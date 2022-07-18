import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

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
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true
                }),
            ],
        },
    },
    resolve: {
        alias: {
            web3: `${__dirname}/node_modules/web3/dist/web3.min.js`,
            util: 'rollup-plugin-node-polyfills/polyfills/util',
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
            $: `${__dirname}/src`,
        },
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill()],
        },
    },
})
