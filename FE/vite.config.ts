import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import eslint from 'vite-plugin-eslint'; 
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173, // 포트는 원하는 포트로 설정
  },
  plugins: [
    react(),
    tailwindcss(),
    eslint(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
