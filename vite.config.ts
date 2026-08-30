import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Rutas absolutas para Vercel
  build: {
    outDir: 'dist',
    copyPublicDir: true // Asegurar que public se copie
  },
  publicDir: 'public'
})
