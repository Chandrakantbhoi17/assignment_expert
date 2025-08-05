import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,                    // Listen on 0.0.0.0
    port: 5173,
    allowedHosts: ['assignmentpros.in'],  // Optional, for dev domain
  },
  build: {
    outDir: 'dist',               // Make sure this matches Nginx config
    emptyOutDir: true,
  },
  base: '/',                      // ✅ Important for correct routing in Nginx
});
