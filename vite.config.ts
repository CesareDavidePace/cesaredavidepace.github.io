// TODO: Consider adding vite-plugin-prerender or @vitejs/plugin-ssr
// for full static HTML generation. Currently the site is a client-side SPA
// which may reduce AI crawler indexability. For now, JSON-LD in index.html
// is the primary signal for AI search engines.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  }
});