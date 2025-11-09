// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Vite 설정 내보내기
export default defineConfig({
  // Vue 플러그인 등록
  plugins: [vue()],
  // import 경로 단축 설정
  // ex) src/api/client.js => @/api/client
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  
  // 개발 서버 설정
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 프록시 처리
      '/api': {
        target: 'http://localhost:80', // 백엔드 서버 주소
        changeOrigin: true,  // 요청 헤더의 Origin을 target으로 변경 -> CORS 방지
        rewrite: (path) => path.replace(/^\/api/, ''), // 경로 재작성: '/api' 제거
      },
    },
  },
})