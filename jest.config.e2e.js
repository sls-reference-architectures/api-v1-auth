const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  globalSetup: './test/common/jest.setup.e2e.js',
  testTimeout: 300000,
};
