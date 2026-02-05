/**
 * Vite Configuration
 * 
 * Fixed: Modern Sass API configuration (no legacy API warnings)
 * Includes: Vue plugin, path aliases, API proxy
 * 
 * @module vite.config
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        // Use modern Sass API (not legacy)
        api: 'modern-compiler',
        // Additional options if needed
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  build: {
    // Optimize build output
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia', 'axios']
        }
      }
    }
  }
})