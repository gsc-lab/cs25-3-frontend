<template>
  <section class="page">
    <h2 class="page-title">HAIRSTYLE</h2>

    <div class="detail-container">
      <div class="detail-header">
        <!-- 제목 -->
        <div class="detail-title">
          {{ title || '제목 없음' }}
        </div>

        <!-- 작성일, 수정일 -->
        <div class="detail-meta">
          <span>작성일: {{ createdAt || '-' }}</span>
          <span class="meta-divider">|</span>
          <span>수정일: {{ updatedAt || '-' }}</span>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="isLoading" class="loading">
        불러오는 중...
      </div>

      <!-- 서버 오류 메시지 -->
      <div v-else>
        <p v-if="errorMessage" class="msg msg-error">
          {{ errorMessage }}
        </p>

        <div v-else>
          <!-- 이미지 -->
          <div class="image-wrapper" v-if="image">
            <img :src="image" alt="헤어스타일 이미지" />
          </div>

          <p v-else class="no-image">등록된 이미지가 없습니다.</p>

          <!-- 설명 -->
          <p v-if="description" class="description">
            {{ description }}
          </p>

          <!-- 버튼 -->
          <div class="btn-group">
            <!-- 목록 이동 버튼 -->
            <button
              type="button"
              class="btn-secondary"
              @click="goList"
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HairstyleApi } from "@/api/hairstyle";

// 라우트 및 라우터 생성
const route = useRoute();
const router = useRouter();
const hairId = route.params.hair_id;

// 목록 변수
const title = ref("");
const description = ref("");
const image = ref("");
const createdAt = ref("");
const updatedAt = ref("");

// 상태 관리 변수
const isLoading = ref(false);
const errorMessage = ref("");

// 헤어스타일 목록 불러오기
const fetchData = async () => {
  try {
    // isLoading 활성화
    isLoading.value = true;

    // 에러 메시지 초기화
    errorMessage.value = "";

    // HairstyleApi.get(hairId)
    const res = await HairstyleApi.get(hairId);
    const body = res;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) throw new Error(body?.error?.message);

    // item 변수에 불러온 정보 저장
    const item = body.data.hairstyle;

    title.value = item.title ?? "";
    description.value = item.description ?? "";
    image.value = item.image ?? "";
    createdAt.value = item.created_at ?? "";
    updatedAt.value = item.updated_at ?? "";
  } catch (err) {
    // 서버 오류 메시지 출력
    errorMessage.value =
      err?.response?.data?.error?.message ?? "데이터를 불러오지 못했습니다.";
    alert(errorMessage.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchData);

// 헤어스타일 목록 이동 함수 정의
const goList = () => router.push("/hairstyle");
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 40px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans KR", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.page-title {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-top: 2px solid #555;
  border-bottom: 1px solid #ddd;
}

.detail-header {
  padding: 24px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.detail-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.detail-meta {
  font-size: 13px;
  color: #666;
  text-align: right;
}

.meta-divider {
  margin: 0 8px;
  color: #aaa;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.msg {
  padding: 10px 20px;
  font-size: 13px;
}

.msg-error {
  color: #d9534f;
}

.image-wrapper {
  padding: 40px 20px 20px;
  text-align: center;
}

.image-wrapper img {
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.no-image {
  padding: 40px 20px 0;
  font-size: 13px;
  color: #777;
  text-align: center;
}

.description {
  font-size: 15px;
  color: #444;
  white-space: pre-wrap;
  padding: 20px;
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
  transition: background-color 0.3s ease;
}

button:hover {
  background: #cfbdaa;
}

.btn-secondary {
  background: #fff;
  color: #555;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background: #f0f0f0;
  border-color: #bbb;
  color: #333;
}

@media (max-width: 768px) {
  .detail-header {
    padding: 20px 15px;
  }

  .detail-title {
    font-size: 18px;
  }

  .description {
    padding: 15px;
  }
}
</style>
