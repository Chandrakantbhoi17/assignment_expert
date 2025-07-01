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
    host: true,     // 👈 exposes the server to your network (0.0.0.0)
    port: 5173,     // 👈 must match the EXPOSE in Dockerfile and docker run
  },
});
