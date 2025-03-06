import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Look for index.html in the root directory
  publicDir: './public', // Static assets folder
  build: {
    outDir: './dist', // Output directory
    emptyOutDir: true, // Clear output directory before building
  },
  server: {
    port: 3000, // Development server port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional: Create an alias for src/
    },
  },
});