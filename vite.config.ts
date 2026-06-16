import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" → 用相對路徑，部署到 GitHub Pages 的子路徑也能正常載入資源。
export default defineConfig({
  base: "./",
  plugins: [react()],
});
