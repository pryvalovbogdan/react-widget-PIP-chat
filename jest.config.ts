export default {
  preset: 'ts-jest',
  displayName: 'i18next-react',
  moduleNameMapper: {
    '^@i18n/(.*)$': '<rootDir>/i18n/$1',
    '^@jestUtils/(.*)$': '<rootDir>/src/jestUtils/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@testing-library)/)', '/node_modules/@testing-library'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/jestUtils/setupTests.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        babelConfig: {
          presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        },
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageThreshold: {
    global: {
      branches: 80,
      lines: 80,
      statements: 80,
      functions: 60,
    },
  },
  type: 'module',
  testMatch: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
};
