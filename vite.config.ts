import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'ShoppingCard',
      short_name: 'ShoppingCard',
      theme_color: '#1976d2',
      background_color: '#fafafa',
      display: 'standalone',
      scope: './',
      start_url: './',
      screenshots: [
        {
          src: 'screenshots/screenshot-wide.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
        },
        {
          src: 'screenshots/screenshot-narrow.png',
          sizes: '390x844',
          type: 'image/png',
          form_factor: 'narrow',
        },
      ],
      icons: [
        { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
        { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
  })],
  test: {
    exclude: ['tests/**', 'node_modules/**'],
  },
})