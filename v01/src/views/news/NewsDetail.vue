<template>
  <article class="page">
    <h2>NEWS</h2>

    <!-- 로딩 -->
    <p v-if="isLoading" class="loading-msg">불러오는 중...</p>
    
    <div v-else class="detail-container">
      
      <div class="detail-header">
        <!-- 제목 -->
        <h3 class="news-title">{{ item.title }}</h3>
        <div class="news-meta">
          <!-- 작성일 및 수정일 -->
          <span class="label">작성일:</span> {{ item.created_at }}
          <span v-if="item.updated_at" class="divider">|</span>
          <span v-if="item.updated_at">
            <span class="label">수정일:</span> {{ item.updated_at }}
          </span>
        </div>
      </div>

      <div class="detail-body">
        <div v-if="item.file" class="image-wrapper">
          <!-- 이미지 -->
          <img
            :src="item.file"
            alt="첨부 이미지"
          >
        </div>

        <!-- 내용 -->
        <div class="content-text">
          {{ item.content }}
        </div>
      </div>

      <!-- 버튼 -->
      <div class="btn-group">
        <!-- 목록 이동 버튼 -->
        <button
          type="button"
          @click="goList"
        >
          목록
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NewsApi } from '@/api/news';

// 라우트 및 라우터 생성
const route = useRoute();
const router = useRouter();
const newsId = route.params.news_id;

// 데이터 보기 변수
const item = reactive({});

// 상태 관리 변수
const isLoading = ref(false);
const errorServerMsg = ref('');

// 공지사항 정보 불러오기
const fetchData = async () => {
    // 오류 메시지 초기화
    errorServerMsg.value = "";

    // isLoading 활성화
    isLoading.value = true

    try {
        // 정보 불러오기
        const res = await NewsApi.detail(newsId);
        const body = res.data;

        // response.data.success가 false일 경우
        // 에러 던지기
        if (!body.success) {
            throw new Error(body?.error?.message);
        }

        // item에 값 저장
        item.title = body.data?.news?.title;
        item.content = body.data?.news?.content;
        item.file = body.data?.news?.file;
        item.created_at = body.data?.news?.created_at;
        item.updated_at = body.data?.news?.updated_at;
    } catch(e) {
        // 서버 오류 메시지 출력
        errorServerMsg.value = e.response?.data?.error?.message;
        console.log(e.response);
        alert(errorServerMsg.value);
    } finally {
        // isLoading 비활성화
        isLoading.value = false;
    }
}

onMounted(fetchData);

// 목록 이동 함수
const goList = () => {
    router.push('/news');
}
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 40px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans KR", sans-serif;
  font-size: 14px;
  color: #333;
}

.page > h2 {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}

.page h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
}

p[v-if="isLoading"] {
  margin: 10px 0;
}

.loading-msg {
    text-align: center;
    color: #666;
    margin: 20px 0;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-top: 2px solid #555;
  border-bottom: 1px solid #ddd;
}

.detail-header {
  padding: 20px 15px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #333;
}

.news-meta {
  font-size: 13px;
  color: #666;
  text-align: right;
}

.news-meta .label {
    font-weight: 600;
    color: #555;
    margin-right: 4px;
}

.news-meta .divider {
  margin: 0 8px;
  color: #aaa;
}

.detail-body {
    padding: 40px 20px;
    min-height: 300px;
}

.image-wrapper {
    margin-bottom: 30px;
    text-align: center;
}

.image-wrapper img {
    max-width: 100%;
    height: auto;
    border: 1px solid #eee;
    border-radius: 4px;
}

.content-text {
    font-size: 15px;
    line-height: 1.8;
    color: #444;
    white-space: pre-wrap;
}

.btn-group {
    display: flex;
    justify-content: center;
    padding: 30px 0;
}

button {
  display: inline-block;
  min-width: 100px;
  padding: 12px 30px;
  
  background: #a8a6a4;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #cfbdaa;
}

@media (max-width: 768px) {
    .page > h2 { font-size: 24px; }
    .news-title { font-size: 18px; }
    .detail-body { padding: 20px 15px; }
}
</style>