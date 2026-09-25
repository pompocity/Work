import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so assets resolve under https://<user>.github.io/<repo>/
export default defineConfig({
  base: './',
  plugins: [react()],
});
