// Global setup for all tests
process.env.NODE_ENV = "test";
process.env.POSTGRES_URL_ONLINE =
  process.env.POSTGRES_URL_ONLINE ||
  "postgresql://test:test@localhost:5432/fabularium_test";
process.env.JWT_SECRET = "test-secret-key";

// Silence console output during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
