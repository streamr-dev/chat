import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['babel-plugin-macros', '@emotion/babel-plugin'],
            },
        }),
    ],
    define: {
        'process.env': {},
        global: 'globalThis',
    },
    resolve: {
        alias: {
            web3: `${__dirname}/node_modules/web3/dist/web3.min.js`,
        },
    },
})
