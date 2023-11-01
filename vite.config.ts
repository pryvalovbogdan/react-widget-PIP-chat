import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@i18n': path.resolve(__dirname, './i18n'),
      src: path.resolve(__dirname, './src'),
      '@jestUtils': path.resolve(__dirname, './src/jestUtils'),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-privkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost-cert.pem')),
    },
  },
});
