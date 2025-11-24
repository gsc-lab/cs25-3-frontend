<template>
  <section class="hero">

    <!-- 슬라이드 -->
    <div
      v-for="(img, index) in images"
      :key="index"
      class="slide"
      :class="{ active: index === currentIndex }"
    >
      <img
        :src="img"
        alt="이미지 없음"
        class="hero-img"
      />
    </div>

    <!-- 좌우 버튼 -->
    <button class="nav prev" @click="prev" aria-label="이전 이미지">
      ‹
    </button>
    <button class="nav next" @click="next" aria-label="다음 이미지">
      ›
    </button>

    <!-- 인디케이터 -->
    <div class="indicators">
      <button
        v-for="(img, index) in images"
        :key="'dot-' + index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const images = [
  'https://pub-08298820ca884cc49d536c1b0ce8b7c4.r2.dev/main/1.jpg',
  'https://pub-08298820ca884cc49d536c1b0ce8b7c4.r2.dev/main/2.jpg',
  'https://pub-08298820ca884cc49d536c1b0ce8b7c4.r2.dev/main/3.jpg'
]

const currentIndex = ref(0)
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + images.length) % images.length
}

const goTo = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  stopAutoPlay()
  timer = setInterval(next, 5000)
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(startAutoPlay)
onBeforeUnmount(stopAutoPlay)
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
}
/* 호버 시 살짝 더 진하게 */
.hero:hover::before {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.65)
  );
}

/* 슬라이드 페이드 애니메이션 */
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.7s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 버튼 / 인디케이터는 shade 위에 올라오도록 z-index 조정 */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  padding: 0.4rem 0.7rem;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
}

.nav.prev {
  left: 0.8rem;
}

.nav.next {
  right: 0.8rem;
}

.indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.dot.active {
  background: rgba(255, 255, 255, 0.95);
}
</style>
