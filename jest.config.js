module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true,
  globals: {
    'ts-jest': {
      'compiler': 'ttypescript'
    }
  },
  setupFiles: [
    '<rootDir>config.ts'
  ]
}