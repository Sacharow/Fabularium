module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "services/**/*.js",
    "controllers/**/*.js",
    "routes/**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**",
  ],
  testTimeout: 10000,
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  bail: false,
  verbose: true,
};
