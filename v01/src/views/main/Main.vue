<template>
  <main class="home">
    <!-- HAIR STYLE -->
    <section class="section">
      <header class="section-header">
        <h2 class="section-title">HAIR STYLE</h2>
        <router-link to="/hairstyle" class="section-more">
          더보기 >
        </router-link>
      </header>

      <div class="hairstyle-grid">
        <p v-if="isLoadingHairstyle" class="helper-text">
          헤어 스타일 불러오는 중...
        </p>
        <!-- hairstyleError가 있을 경우 - 에러 메시지 -->
        <p v-else-if="hairstyleError" class="helper-text error">
          {{ hairstyleError }}
        </p>

        <!-- 이미지에 링크 걸기 -->
        <router-link
          v-for="item in hairstyles"
          :key="item.hair_id"
          :to="`/hairstyle/${item.hair_id}`"
          class="hairstyle-card"
        >
          <div class="thumb-wrapper">
            <img
              :src="item.image"
              :alt="item.title"
              class="thumb"
            />
          </div>
          <p class="card-title">
            {{ item.title }}
          </p>
        </router-link>

        <!-- 헤어스타일이 없을 경우 -->
        <p
          v-if="hairstyles.length === 0"
          class="helper-text"
        >
          등록된 헤어스타일이 없습니다.
        </p>
      </div>
    </section>

    <!-- NEWS -->
    <section class="section">
      <header class="section-header">
        <h2 class="section-title">NEWS</h2>
        <router-link to="/news" class="section-more">
          더보기 >
        </router-link>
      </header>

      <div class="news-list">
        <p v-if="isLoadingNews" class="helper-text">
          공지사항 불러오는 중...
        </p>
        <!-- 공지사항 에러가 있을 경우 -> 에러 메시지 -->
        <p v-else-if="newsError" class="helper-text error">
          {{ newsError }}
        </p>

        <article
          v-for="item in news"
          :key="item.news_id"
          class="news-item"
        >
          <!-- 공지사항 링크 걸기 -->
          <router-link
            :to="`/news/${item.news_id}`"
            class="news-link"
          >
            <h3 class="news-title">{{ item.title }}</h3>
            <p class="news-meta">
              {{ item.created_at }}
            </p>
            <p class="news-summary">
              {{ item.content }}
            </p>
          </router-link>
        </article>

        <!-- 공지사항이 없을 경우 -->
        <p
          v-if="news.length === 0"
          class="helper-text"
        >
          등록된 공지사항이 없습니다.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { HairstyleApi } from '@/api/hairstyle';
import { NewsApi } from '@/api/news';

// 헤어스타일, 뉴스 변수
const hairstyles = ref([]);
const news = ref([]);

// 상태 관리 변수
const isLoadingHairstyle = ref(false);
const isLoadingNews = ref(false);
const hairstyleError = ref('');
const newsError = ref('');

const fetchList = async () => {
  // 헤어스타일 최신 6개
  try {
    // isLoadingHairstyle 활성화
    isLoadingHairstyle.value = true;

    // 헤어스타일 정보 불러오기
    const res = await HairstyleApi.mainHairstyle(6);
    const body = res.data;
    hairstyles.value = body?.data?.hairstyle;
  } catch (e) {
    // 서버 오류 저장
    console.error(e);
    hairstyleError.value = '헤어 스타일을 불러오는 중 오류가 발생했습니다.';
  } finally {
    // isLoadingHairstyle 비활성화
    isLoadingHairstyle.value = false;
  }

  // 뉴스 최신 3개
  try {
    // isLoadingNews 활성화
    isLoadingNews.value = true;

    // 공지사항 정보 불러오기
    const res = await NewsApi.mainNews(3);
    const body = res.data;
    news.value = body?.data?.news;
  } catch (e) {
    // 서버 오류 저장
    console.error(e);
    newsError.value = '뉴스를 불러오는 중 오류가 발생했습니다.';
  } finally {
    // isLoadingNews 비활성화
    isLoadingNews.value = false;
  }
};

onMounted(fetchList);

</script>

<style scoped>
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

/* 공통 섹션 레이아웃 */
.section + .section {
  margin-top: 40px;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.section-more {
  font-size: 13px;
  text-decoration: none;
}

.hairstyle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.hairstyle-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #fff;
}

.thumb-wrapper {
  aspect-ratio: 1 / 1;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title {
  margin-top: 5px;
  font-size: 13px;
  text-align: center;
  color: #333;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-item {
  border: 1px solid #ddd;
  padding: 10px 12px;
  background-color: #fafafa;
}

.news-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.news-meta {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
}

.news-summary {
  font-size: 13px;
  color: #555;
}

.helper-text {
  font-size: 13px;
  color: #666;
}

.helper-text.error {
  color: #c00;
}

/* 반응형 */
@media (max-width: 768px) {
  .hairstyle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .hairstyle-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
