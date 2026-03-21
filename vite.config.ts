import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/rewle/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        higherLower: resolve(__dirname, "higher-lower.html"),
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
