import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          motion: ['framer-motion'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
