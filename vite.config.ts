import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the static build works on GitHub Pages, Render, and any subpath.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
})
