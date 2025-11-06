// vue-router에서 createApp, createWebHistory 함수 불러오기
import { createApp, createWebHistory } from 'vue-router'

// 라우터 URL과 연결할 view 컴포넌트 가져오기
// import Main from '@/views/Main.vue'

// 라우터 설정
export default createApp({
    history: createWebHistory(),
    routes: [
        // { path: '/', component: Main}
    ]
})