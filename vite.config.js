import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Pages that need bundling (Three.js, etc.)
        wrapped: resolve(__dirname, 'src/pages/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    // Don't minify for easier debugging in dev
    minify: false,
    // Generate source maps
    sourcemap: true,
  },
  // Base path for Chrome extension
  base: './',
  // Resolve aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@three': resolve(__dirname, 'src/three'),
      '@services': resolve(__dirname, 'src/services'),
      '@animations': resolve(__dirname, 'src/animations'),
    }
  },
  // Dev server config (for testing outside extension)
  server: {
    port: 3000,
    open: '/src/pages/index.html'
  }
});
