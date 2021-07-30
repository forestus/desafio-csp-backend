module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  moduleNameMapper: {
    '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@repositories/(.*)': '<rootDir>/src/repositories/$1',
    '@entities/(.*)': '<rootDir>/src/entities/$1',
    '@database/(.*)': '<rootDir>/src/database/$1',
    '@docs/(.*)': '<rootDir>/docs/$1',
    '@errors/(.*)': '<rootDir>/src/errors/$1'
  },
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['<rootDir>/src/server.spec.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
