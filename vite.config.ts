import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed to https://tewei02.github.io/StatSigCalculator/ — keep the base in sync
// with the repository name so assets, the manifest and the service worker resolve.
export default defineConfig({
  base: '/StatSigCalculator/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
});
