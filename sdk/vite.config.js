import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/tracker.js'),
      name: 'SessionTracker',
      fileName: () => 'tracker.js',
      formats: ['iife']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [], // bundle rrweb inside
      output: {
        extend: true
      }
    }
  }
});
