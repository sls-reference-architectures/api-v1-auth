const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  globalSetup: './test/common/jest.setup.int.js',
  testTimeout: 600000,
};
