import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), VitePWA()],
  test: {
    exclude: ['tests/**', 'node_modules/**'],
  },
})
