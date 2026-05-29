import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "https://treqe-production-8518.up.railway.app", changeOrigin: true, secure: true },
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
      },
    },
  },
});
