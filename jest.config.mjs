const config = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\$/(.*)': '<rootDir>/src/$1',
        '^dexie$': '<rootDir>/node_modules/dexie',
        '^multiformats$': '<rootDir>/node_modules/multiformats/cjs/src/index.js',
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/mocks/file.ts',
    },
    setupFiles: ['fake-indexeddb/auto'],
}

export default config
