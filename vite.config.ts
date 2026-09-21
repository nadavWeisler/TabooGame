import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project GitHub Pages is served from /TabooGame/. Local/dev keeps a relative
// base so preview still works from any path.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/TabooGame/' : './',
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
})
