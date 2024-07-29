// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///home/paullaster/Documents/projects/others/noels/Shoal/node_modules/vite/dist/node/index.js";
import vue from "file:///home/paullaster/Documents/projects/others/noels/Shoal/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///home/paullaster/Documents/projects/others/noels/Shoal/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import vuetify from "file:///home/paullaster/Documents/projects/others/noels/Shoal/node_modules/vite-plugin-vuetify/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///home/paullaster/Documents/projects/others/noels/Shoal/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    vuetify({
      autoImport: { labs: true }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  envPrefix: "VUE_APP",
  server: {
    port: 3e3,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wYXVsbGFzdGVyL0RvY3VtZW50cy9wcm9qZWN0cy9vdGhlcnMvbm9lbHMvU2hvYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3BhdWxsYXN0ZXIvRG9jdW1lbnRzL3Byb2plY3RzL290aGVycy9ub2Vscy9TaG9hbC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wYXVsbGFzdGVyL0RvY3VtZW50cy9wcm9qZWN0cy9vdGhlcnMvbm9lbHMvU2hvYWwvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgdnVldGlmeSBmcm9tICd2aXRlLXBsdWdpbi12dWV0aWZ5J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIFZ1ZURldlRvb2xzKCksXG4gICAgdnVldGlmeSh7XG4gICAgICBhdXRvSW1wb3J0OiB7IGxhYnM6IHRydWUgfVxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9LFxuICBlbnZQcmVmaXg6ICdWVUVfQVBQJyxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBob3N0OiB0cnVlLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLGVBQWUsV0FBVztBQUN2WCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxhQUFhO0FBSmdNLElBQU0sMkNBQTJDO0FBT3JRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxNQUNOLFlBQVksRUFBRSxNQUFNLEtBQUs7QUFBQSxJQUMzQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
