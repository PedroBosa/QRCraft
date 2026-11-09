import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Caminho relativo essencial para deploy transparente no GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          styling: ['qr-code-styling'],
          pdf: ['jspdf'],
          scanner: ['html5-qrcode'],
        },
      },
    },
  },
});
