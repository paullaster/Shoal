import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools(), vuetify({
    autoImport: { labs: true }
  }),
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    injectRegister: 'script',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    manifest: {
      name: 'Noel\'s Fish Deliveries',
      short_name: 'N\'sFD',
      description: 'Noel\'s Fish Deliveries App',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }
  }),
  sentryVitePlugin({
    org: "brainspore-llc",
    project: "noelsdeliveries"
  })],
  css: {
    preprocessorMaxWorkers: 2,
  },
  build: {
    cssCodeSplit: true,
    cssTarget: 'es2015',
    cssMinify: 'esbuild',
    assetsInlineLimit: 2048,
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    brotliSizeWarningLimit: 1000,
    chunkSizeLimit: 1000,
    brotliSizeLimit: 1000,
    chunkIds: 'deterministic',
    chunkMinSize: 1000,
    chunkSort: 'size',
    cache: true,
    cacheDir: '.vite/dist',
    write: true,
    manifest: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  envPrefix: 'VUE_APP',
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['5b26628fc49a7fcea9a221d180465a22.serveo.net']
  }
})