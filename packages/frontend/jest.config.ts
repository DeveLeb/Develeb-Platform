import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

// Custom Jest configuration
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.polyfills.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
};

// Export the Jest config
export default createJestConfig(config);
