import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",  // This is crucial for Firebase
  build: {
    outDir: "dist",
    emptyOutDir: true,  // Clears the dist folder on each build
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      }
    }
  },
  server: {
    port: 3000
  }
});