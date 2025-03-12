/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
      '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: 'tsconfig.app.json' 
      }]
  }
};
