// vue-router에서 createApp, createWebHistory 함수 불러오기
import { createRouter, createWebHistory } from 'vue-router'

// 라우터 URL과 연결할 view 컴포넌트 가져오기
// import Main from '@/views/Main.vue'
import UsersRegister from "@/views/users/UsersRegister.vue";
import UsersLogin from "@/views/users/UsersLogin.vue";
import UsersLogout from "@/views/users/UsersLogout.vue";
import Mypage from "@/views/mypage/Mypage.vue";

// 라우터 설정
export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/users/create', component: UsersRegister },
        { path: '/users/login', component: UsersLogin },
        { path: '/users/logout', component: UsersLogout},
        { path: '/mypage', component: Mypage.vue },
    ]
});