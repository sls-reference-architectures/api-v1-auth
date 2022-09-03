module.exports = {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.build/'],
  testTimeout: 600000,
  setupFilesAfterEnv: ['jest-extended/all'],
};
