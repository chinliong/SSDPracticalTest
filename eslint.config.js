const js = require("@eslint/js");
const pluginSecurity = require("eslint-plugin-security");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly"
      }
    },
    plugins: {
      security: pluginSecurity
    },
    rules: {
      "no-unused-vars": "error",
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-var": "error",
      "prefer-const": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "warn"
    }
  },
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "reports/",
      ".scannerwork/"
    ]
  }
];