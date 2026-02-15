import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/server.ts',
    ],
};

export default config;
