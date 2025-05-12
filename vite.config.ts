import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', 
  publicDir: './public', 
  build: {
    outDir: './dist', 
    emptyOutDir: true, 
    rollupOptions: {
        input: {
            main: path.resolve(__dirname, "index.html"),
            webgpu: path.resolve(__dirname, "webgpu.html")
        }
    },
  },
  server: {
    port: 3000, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
});
