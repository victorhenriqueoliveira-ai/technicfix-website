import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@base-ui/react/(.*)$': '<rootDir>/node_modules/@base-ui/react/$1/index.js',
  },
  setupFiles: ['<rootDir>/__tests__/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__/jest.setup.ts'],
  collectCoverageFrom: ['lib/**/*.ts', 'actions/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
}

export default config
