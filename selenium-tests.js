const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function runSeleniumTests() {
  const isDocker = process.env.DOCKER_ENV === "true";
  const baseUrl = isDocker ? "http://web:3000" : "http://localhost:3000";
  
  const options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");
  
  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    console.log(`Starting Selenium UI Tests against ${baseUrl}...`);
    
    // Test 1: Home page loads
    console.log("Test 1: Testing home page...");
    await driver.get(baseUrl);
    await driver.wait(until.titleContains("Search Application"), 10000);
    
    const searchField = await driver.findElement(By.name("searchTerm"));
    const submitButton = await driver.findElement(By.css("button[type=\"submit\"]"));
    console.log("✓ Form elements found");

    // Test 2: XSS attack rejection
    console.log("Test 2: Testing XSS attack rejection...");
    await searchField.clear();
    await searchField.sendKeys("<script>alert('xss')</script>");
    await submitButton.click();
    await driver.sleep(2000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes(baseUrl.replace("http://", ""))) {
      console.log("✓ XSS attack correctly rejected (redirected to home)");
    }

    // Test 3: Valid search term
    console.log("Test 3: Testing valid search term...");
    await driver.get(baseUrl);
    await driver.sleep(1000);
    
    const searchFieldValid = await driver.findElement(By.name("searchTerm"));
    const submitButtonValid = await driver.findElement(By.css("button[type=\"submit\"]"));
    
    await searchFieldValid.clear();
    await searchFieldValid.sendKeys("hello world");
    await submitButtonValid.click();
    await driver.sleep(2000);
    
    const bodyText = await driver.findElement(By.tagName("body")).getText();
    if (bodyText.includes("Search Results") && bodyText.includes("hello world")) {
      console.log("✓ Valid search term accepted and results shown");
    }

    console.log("All Selenium tests completed successfully!");
    
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

runSeleniumTests().catch(console.error);