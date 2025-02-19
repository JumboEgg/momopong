import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import eslint from 'vite-plugin-eslint'; 
import { defineConfig } from "vite";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173, // 포트는 원하는 포트로 설정
  },
  plugins: [
    react(),
    tailwindcss(),
    eslint(),
    visualizer({
      open: true,  // 빌드 후 자동으로 stats.html 열기
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  }
});
