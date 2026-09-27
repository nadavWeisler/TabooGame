import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site is /TabooGame/. Local/dev keeps a relative base.
export default defineConfig({
  plugins: [react()],
  base: process.env.PAGES_BASE ?? (process.env.GITHUB_ACTIONS ? '/TabooGame/' : './'),
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
})
