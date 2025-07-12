import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import vuetify from 'vite-plugin-vuetify';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VueDevTools(),
    vuetify({
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Add this line to increase the maximum file size for precaching
        // The error mentioned 2.82 MB, so 3 MB (3 * 1024 * 1024 bytes) or 4 MB would be safe.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 // Set to 4 MB
      },
      manifest: {
        name: 'Noels',
        short_name: 'Noels',
        description: 'Order fresh fish delivered to your door with Noels.',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android-chrome-512x512.png',
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
    })
  ],
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
    // The following chunk/brotli size limits and related options in your build config
    // seem quite restrictive (1KB). This might lead to more chunks being generated
    // or warnings if not carefully managed. If you're experiencing performance issues
    // due to too many small chunks, you might want to adjust these.
    // For now, I'm keeping them as they were in your original config.
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
    allowedHosts: ['noelsdeliveries.com', 'localhost']
  }
})