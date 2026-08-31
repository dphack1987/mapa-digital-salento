import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Rutas absolutas para Vercel
  build: {
    outDir: 'dist',
    copyPublicDir: true, // Asegurar que public se copie
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia
    minify: 'terser', // Minificación más agresiva
    sourcemap: false, // Desactivar sourcemaps en producción
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunking simplificado para evitar circular dependencies
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) {
              return 'leaflet-vendor'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('lucide')) {
              return 'ui-vendor'
            }
            // Todo lo demás va a un solo vendor chunk
            return 'vendor'
          }
        },
        // Optimizar nombres de chunks para caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Optimización de target para navegadores modernos
    target: 'esnext',
    // Habilitar CSS code splitting
    cssCodeSplit: true,
    // Compresión adicional
    reportCompressedSize: true
  },
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
  },
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'leaflet', 'lucide-react', 'qrcode'],
    force: false
  }
})
