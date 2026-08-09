import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  // GH_PAGES_BASE is set by the GitHub Actions workflow to "/<repo-name>/"
  // so assets resolve correctly when the site is served from a project page
  // (https://<user>.github.io/<repo-name>/). Locally this falls back to "/".
  base: process.env.GH_PAGES_BASE || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
