import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // 127.0.0.1 뿐 아니라 privideo.cloud 도 수용
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "privideo.cloud-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "privideo.cloud.pem")),
    },
    hmr: {
      host: 'app.privideo.cloud', // 브라우저에서 접근하는 도메인
      protocol: 'wss',         // dev니까 ws
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})