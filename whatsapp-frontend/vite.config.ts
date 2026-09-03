import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/crm-api': {
        target: 'https://uncle-prideful-uncloak.ngrok-free.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/crm-api/, ''),
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});