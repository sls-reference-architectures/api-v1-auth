module.exports = {
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.build/'],
  testTimeout: 600000,
  setupFilesAfterEnv: ['jest-extended/all'],

  // From https://github.com/ottokruse/jest-subpath-import/blob/main/jest.config.fix.js:
  // I don't like having to do this config.
  // This is an implementation detail of aws-jwt-verify
  // that I shouldn't have to know about
  moduleNameMapper: {
    '#node-web-compat': './node-web-compat-node.js',
  },
};
