const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  globalSetup: './common/test/jest.setup.int.ts',
  testTimeout: 600000,
};
