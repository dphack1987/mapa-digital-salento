/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// Páginas estáticas (categorías, pautantes, landings): inyecta el script de
// temporada navideña en <head> (sincrónico → sin FOUC). Excluye las SPAs
// React (index y mapa), que ya tienen su propio anti-FOUC.
function injectChristmasStatic() {
  return {
    name: 'inject-christmas-static',
    closeBundle() {
      const distDir = resolve(rootDir, 'dist')
      if (!fs.existsSync(distDir)) return
      let injected = 0
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = resolve(dir, entry.name)
          if (entry.isDirectory()) {
            walk(full)
            continue
          }
          if (!entry.name.endsWith('.html')) continue
          const rel = full.slice(distDir.length + 1).replace(/\\/g, '/')
          if (rel === 'index.html' || rel === 'mapa-interactivo-salento.html') continue
          let html = fs.readFileSync(full, 'utf8')
          if (html.includes('/christmas-static.js')) continue
          if (!html.includes('</head>')) continue
          html = html.replace('</head>', '  <script src="/christmas-static.js"></script>\n  </head>')
          fs.writeFileSync(full, html, 'utf8')
          injected++
        }
      }
      walk(distDir)
      console.log(`christmas-static.js injected into ${injected} static HTML pages`)
    }
  }
}

export default defineConfig({
  plugins: [react(), injectChristmasStatic()],
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
