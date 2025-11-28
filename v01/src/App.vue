<template>
  <!-- Header 파일 상단 고정 -->
  <Header />

  <!-- 라우터로 연결되는 views 폴더의 파일 렌더링 -->
  <router-view />

  <!-- Footer 파일 하단 고정 -->
   <Footer />
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>
