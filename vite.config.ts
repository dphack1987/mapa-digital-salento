import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mapa-digital-salento/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
