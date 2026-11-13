/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    chunkSizeWarningLimit: 400,
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        mapa: resolve(rootDir, 'mapa-interactivo-salento.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react-core'
            }
            if (id.includes('react-helmet')) {
              return 'seo-vendor'
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'leaflet-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor'
            }
            if (id.includes('qrcode')) {
              return 'qr-vendor'
            }
            return 'vendor'
          }
          // Servicios: separados por dominio para cachear entre despliegues
          // y mantener cada chunk por debajo del límite de aviso.
          if (id.includes('/services/')) {
            if (id.includes('translation')) return 'i18n'
            if (id.includes('donChucho')) return 'don-chucho'
            if (/seo|backlink|ally|schema/i.test(id)) return 'seo-services'
            return 'app-services'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: true,
    assetsInlineLimit: 4096
  },
  publicDir: 'public',
  server: {
    port: 3000,
    host: '0.0.0.0', // Permitir acceso desde dispositivos externos
    strictPort: false,
    open: false
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'leaflet', 'lucide-react', 'qrcode'],
    force: false
  }
})
