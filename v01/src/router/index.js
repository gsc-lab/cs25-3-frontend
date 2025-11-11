// vue-router에서 createRouter, createWebHistory 함수 불러오기
import { createRouter, createWebHistory } from 'vue-router'

// 라우터 URL과 연결할 view 컴포넌트 가져오기
import Test from "@/views/users/Test.vue";

// 라우터 설정
export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/test", name: "test", component: Test }
    ]
})