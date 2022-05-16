import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          'babel-plugin-macros',
          '@emotion/babel-plugin',
        ],
      },
    }),
  ],
})
