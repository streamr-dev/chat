/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '\\$/(.*)': '<rootDir>/src/$1',
    },
}

export default config
