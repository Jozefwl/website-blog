import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  // Shown on the rack's serial label. CI bumps package.json, so this stays in sync.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // Inline PostCSS config: Vite then ignores any leftover postcss.config.* file.
  css: {
    postcss: {},
  },
  server: {
    // Port 3000 matches the backend's dev CORS allow-list (http://localhost:3000).
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
});
