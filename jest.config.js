module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "app.js",
    "!node_modules/**",
    "!coverage/**",
    "!jest.config.js",
    "!eslint.config.js",
    "!selenium-tests.js",
    "!**/*.test.js",
  ],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  verbose: true,
  testTimeout: 10000,
};