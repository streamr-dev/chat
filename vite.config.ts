import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'

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
        ...[process.env.ANALYSE && visualizer()].filter(Boolean),
    ],
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
            define: {
                global: 'globalThis',
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
            ],
        },
    },
    resolve: {
        alias: {
            stream: 'rollup-plugin-node-polyfills/polyfills/stream',
            web3: `${__dirname}/node_modules/web3/dist/web3.min.js`,
            util: 'rollup-plugin-node-polyfills/polyfills/util',
            assert: 'rollup-plugin-node-polyfills/polyfills/assert',
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
            $: `${__dirname}/src`,
            '@walletconnect/universal-provider': `${__dirname}/node_modules/@walletconnect/universal-provider/dist/index.es.js`,
        },
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill()],
        },
    },
    esbuild: {
        define: {
            this: 'window',
        },
    },
})
