const request = require("supertest");
const { app, server, validateSearchTerm } = require("./app");

afterAll((done) => {
  if (server && server.listening) {
    server.close(done);
  } else {
    done();
  }
});

describe("Search Term Validation", () => {
  test("should detect XSS attack", () => {
    const result = validateSearchTerm("<script>alert('xss')</script>");
    expect(result.isValid).toBe(false);
    expect(result.type).toBe('xss');
  });

  test("should detect SQL injection", () => {
    const result = validateSearchTerm("'; DROP TABLE users; --");
    expect(result.isValid).toBe(false);
    expect(result.type).toBe('sql');
  });

  test("should accept valid search term", () => {
    const result = validateSearchTerm("hello world");
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('valid');
  });

  test("should detect javascript in input", () => {
    const result = validateSearchTerm("javascript:alert(1)");
    expect(result.isValid).toBe(false);
    expect(result.type).toBe('xss');
  });

  test("should detect union select attack", () => {
    const result = validateSearchTerm("1 UNION SELECT * FROM users");
    expect(result.isValid).toBe(false);
    expect(result.type).toBe('sql');
  });
});

describe("Web Application", () => {
  test("should return home page on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Search Application");
    expect(response.text).toContain("Enter search term:");
  });

  test("should redirect on XSS attack", async () => {
    const response = await request(app)
      .post("/search")
      .send({ searchTerm: "<script>alert('xss')</script>" });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("should redirect on SQL injection", async () => {
    const response = await request(app)
      .post("/search")
      .send({ searchTerm: "'; DROP TABLE users; --" });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("should display valid search term", async () => {
    const response = await request(app)
      .post("/search")
      .send({ searchTerm: "hello world" });
    expect(response.status).toBe(200);
    expect(response.text).toContain("Search Results");
    expect(response.text).toContain("hello world");
    expect(response.text).toContain("Return to Home");
  });

  test("health check endpoint should work", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});