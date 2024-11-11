const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  globalSetup: './common/test/jest.setup.int.js',
  testTimeout: 600000,
};
