const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// HTML escape function to prevent XSS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input validation function
function validateSearchTerm(input) {
  if (!input || typeof input !== "string") {
    return { isValid: true, type: "valid" };
  }

  // XSS Detection - OWASP Control C5: Validate All Inputs
  const xssPatterns = [
    // Simple string-based checks to avoid ReDoS
    /<script/gi,
    /<\/script>/gi,
    /javascript:/gi,
    /\bon\w+=|onclick=|onload=|onerror=/gi,
    /<iframe/gi,
    /<\/iframe>/gi,
    /<object/gi,
    /<\/object>/gi,
    /<embed/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /<img.*javascript:/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, type: "xss" };
    }
  }

  // SQL Injection Detection
  const sqlPatterns = [
    /\b(select|insert|update|delete|drop|create|alter|exec|execute|union|or|and)\b/gi,
    /['"];|--|\/\*|\*\//g,
    /\s+(or|and)\s+\d+=\d+/gi,
    /\bunion\s+select/gi,
    /\bunion\s+all\s+select/gi,
    /\b(exec|execute)\(/gi,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, type: "sql" };
    }
  }

  return { isValid: true, type: "valid" };
}

// Routes
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Application</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
            .form-container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
            input[type="text"] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 3px; }
            button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
            button:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="form-container">
            <h2>Search Application</h2>
            <form method="POST" action="/search">
                <label for="searchTerm">Enter search term:</label>
                <input type="text" id="searchTerm" name="searchTerm" required>
                <button type="submit">Search</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

app.post("/search", (req, res) => {
  const { searchTerm } = req.body;
  const validation = validateSearchTerm(searchTerm);

  if (!validation.isValid) {
    // Clear input and return to home page for XSS or SQL injection
    return res.redirect("/");
  }

  // Valid input - display search terms
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Results</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
            .result-container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; text-align: center; }
            button { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
            button:hover { background-color: #218838; }
        </style>
    </head>
    <body>
        <div class="result-container">
            <h2>Search Results</h2>
            <p><strong>Search Term:</strong> ${escapeHtml(searchTerm)}</p>
            <form method="GET" action="/">
                <button type="submit">Return to Home</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server, validateSearchTerm };
