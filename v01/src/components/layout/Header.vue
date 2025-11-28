<template>
  <header class="header">
    <!-- 로고 -->
    <router-link to="/" class="logo">kimhadiii Salon</router-link>

    <!-- 햄버거 아이콘 -->
    <button class="hamburger" @click="menuOpen = !menuOpen">
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
    </button>

    <!-- 메뉴 -->
    <nav class="nav" :class="{ open: menuOpen }">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        @click="menuOpen = false"
      >
        {{ item.label }}
      </router-link>
    </nav>

    <!-- 로그인 / 로그아웃 -->
    <template v-if="userStore.user.role !== 'guest'">
      <p class="login-info">
        {{ userStore.user.user_name }}({{ userStore.user.role }})님
        <button class="logout" @click="onLogout">LOGOUT</button>
      </p>
    </template>
    <template v-else>
      <router-link to="/users/login" class="login">LOGIN</router-link>
    </template>
  </header>

  <MainHero />
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { UsersApi } from '@/api/users';
import MainHero from '@/components/layout/MainHero.vue';

const userStore = useUserStore()
const router = useRouter()

// 모바일 메뉴 상태
const menuOpen = ref(false)

const navItems = [
  { to: '/salon', label: 'SALON' },
  { to: '/service', label: 'SERVICE' },
  { to: '/hairstyle', label: 'HAIR STYLE' },
  { to: '/designer', label: 'DESIGNER' },
  { to: '/reservation', label: 'RESERVATION' },
  { to: '/news', label: 'NEWS' },
  { to: '/mypage', label: 'MYPAGE' }
];

// 로그아웃
const onLogout = async () => {
  const isLogout = confirm('정말 로그아웃하시겠습니까?')
  if (!isLogout) return

  // UserApi.logout()
  await UsersApi.logout();

  // userStore에서 로그아웃
  userStore.logout()
  alert("로그아웃이 완료되었습니다.")
  router.push('/')
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #ffffff;
}

.logo {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  color: #111;
  white-space: nowrap;
}

/* PC 메뉴 */
.nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 1.8rem;
  transition: 0.3s ease;
}

.nav-link {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-decoration: none;
  color: #666;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

/* 활성 메뉴 */
.nav-link.router-link-active {
  color: #111;
  font-weight: 600;
  border-color: #111;
}

/* 로그인 영역 */
.login-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.75rem;
  color: #555;
  white-space: nowrap;
}

.login,
.logout {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  padding: 0.35rem 0.9rem;
}

.login {
  border: 1px solid #111;
  background: #fff;
  color: #111;
}

.logout {
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
}

/* -- 모바일 햄버거 버튼 -- */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger span {
  width: 22px;
  height: 2px;
  background: #111;
  transition: 0.3s;
}

.hamburger span.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* -- 모바일 반응형 -- */
@media (max-width: 960px) {
  .hamburger {
    display: flex;
  }

  /* 메뉴 기본적으로 숨김 */
  .nav {
    position: absolute;
    top: 60px;
    right: 0;
    width: 60%;
    max-width: 260px;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: #ffffff;
    border-left: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    opacity: 0;
    pointer-events: none;
  }

  /* 메뉴 열림 */
  .nav.open {
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f2f2f2;
  }

  /* 데스크톱용 가운데 정렬 제거 */
  .nav {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .header {
    flex-wrap: wrap;
  }

  .login-info {
    font-size: 0.7rem;
  }
}
</style>
