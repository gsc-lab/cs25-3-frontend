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
    <router-link to="/login" class="login">LOGIN</router-link>

  </header>
</template>


<script setup>

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

</script>
