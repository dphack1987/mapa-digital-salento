import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Rutas relativas para abrir archivo directamente
  build: {
    outDir: 'dist'
  }
})
