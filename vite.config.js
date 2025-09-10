import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

export default defineConfig({
  base: "./", // 👈 dòng này bắt buộc để dùng đường dẫn tương đối khi deploy
  plugins: [
    react(),
    {
      name: "copy-redirects",
      closeBundle() {
        const src = resolve(__dirname, "public/_redirects");
        const dest = resolve(__dirname, "dist/_redirects");
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log("✅ _redirects copied to dist/");
        } else {
          console.warn("⚠️ No _redirects file found in public/");
        }
      }
    }
  ],
  build: {
    outDir: "dist",   // đảm bảo output nằm trong dist
    emptyOutDir: true // xoá sạch dist trước khi build
  }
});
