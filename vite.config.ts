import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Rutas absolutas para Vercel
  build: {
    outDir: 'dist',
    copyPublicDir: true, // Asegurar que public se copie
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          'ui-vendor': ['lucide-react'],
          'utils-vendor': ['qrcode', 'react-helmet-async']
        }
      }
    }
  },
  publicDir: 'public'
})
