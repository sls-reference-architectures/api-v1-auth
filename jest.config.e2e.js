const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  globalSetup: './common/test/jest.setup.e2e.js',
  testTimeout: 300000,
};
