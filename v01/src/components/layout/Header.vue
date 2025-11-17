<template>
  <header class="header">
    <!-- 로고 -->
    <!-- 로그를 클릭하면 홈(/)으로 이동 -->
    <router-link to="/" class="logo">kimhadiii Salon</router-link>

    <!-- 메뉴 (PC) -->
    <!-- 내비게이션 바 -->
    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
      >
        <!-- 실제 메뉴명 표시 -->
        {{ item.label }}
      </router-link>
    </nav>

    <!-- 로그인 버튼 -->
    <!-- /login 경로로 이동하는 버튼 -->
    <template v-if="userStore.user">
    <p class="login-info">
      {{ userStore.user.role }} - {{ userStore.user.user_name }}({{ userStore.user.account }})님
      <button class="logout" @click="onLogout">LOGOUT</button>
    </p>
    
    </template>
    <template v-else>
    <router-link to="/users/login" class="login">LOGIN</router-link>
    </template>
    
  </header>
</template>


<script setup>

import { useUserStore } from '@/stores/user';
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

// 메뉴 목록
// 각 항목은 { to, label } 형태의 객체
// to: 이동 경로
// label: 화면에 표시되는 텍스트
const navItems = [
  { to: '/salon', label: 'SALON' },
  { to: '/service', label: 'SERVICE' },
  { to: '/hairstyle', label: 'HAIR STYLE' },
  { to: '/staff', label: 'STAFF' },
  { to: '/bookings', label: 'BOOKINGS' },
  { to: '/news', label: 'NEWS' },
  { to: '/mypage', label: 'MYPAGE' }
]

// 로그아웃
function onLogout() {
  const isLogout = confirm("정말 로그아웃하시겠습니까?");
  if (!isLogout) return;
  userStore.logout();      // 저장된 user 삭제
  router.push("/users/login");   // 로그인 화면으로 이동
}

</script>
