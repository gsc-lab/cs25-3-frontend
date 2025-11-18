<template>
  <section class="list-section">
    <h2>공지사항 목록</h2>

    <!-- if 로딩 중 -->
    <p v-if="isLoading">불러오는 중...</p>

    <!-- else-if 에러 발생 -->
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- else-if 목록이 비어있을 때 -->
    <p v-else-if="items.length === 0">등록된 공지사항이 없습니다.</p>
    

    <!-- 목록 렌더링 -->
    <div v-else class="list">
      <article
        v-for="item in items"
        :key="item.news_id"
        class="card"
      >
        <!-- 이미지 영역 -->
        <div class="thumb">
          <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          >
          <div v-else class="no-image">이미지 없음</div>
        </div>

        <!-- 정보 영역 -->
        <div class="info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p>ID: {{ item.news_id }}</p>

          <!-- 액션 버튼 -->
          <div class="actions">
            <!-- 수정 페이지 이동 -->
            <router-link :to="`/news/update/${item.news_id}`">
              수정
            </router-link>

            <!-- 삭제 버튼 -->
            <button
              type="button"
              class="del-button"
              @click="handleDelete(item.news_id)"
              >
              {{ deletingId === item.news_id ? "삭제 중..." : "삭제" }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- 신규 등록 버튼 -->
    <router-link to="/news/create">등록하기</router-link>
  </section>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NewsApi } from "@/api/news";

// 상태 관리 변수
const items = ref([]);           // 목록 데이터
const isLoading = ref(false);    // 로딩 상태
const errorMessage = ref("");    // 에러 메시지
const deletingId = ref(null);    // 현재 삭제 중인 news_id

// 목록 조회
const fetchList = async () => {
    isLoading.value = true;   // 로딩 시작
    errorMessage.value = "";  // 에러 메시지 초기화

    try {
        // news API 호출
        const res = await NewsApi.list();
        
        // 응답 데이터를 items 변수에 저장
        items.value = res.data?.news ?? [];

    } catch(e) {
        // 서버 에러
        errorMessage.value = e.response?.data?.error?.message
    } finally {
        // 로딩 종료
        isLoading.value = false;
    }
};

// 컴포넌트 첫 렌더링 시 목록 불러오기
onMounted(fetchList);

// 삭제 처리
const handleDelete = async (newsId) => {
    const ok = confirm("이 게시물을 삭제하시겠습니까?");
    if (!ok) return;  // 삭제 처리 함수 종료

    try {
        // 현재 삭제 중인 newsId값 부여
        deletingId.value = newsId;

        // DELETE
        const res = await NewsApi.delete(newsId);
        const status = res ?? 0;  // response.status

        // 백엔드에서 204 응답 기대
        // 204 코드가 아닐 경우
        if (status !== 204) {
            throw new Error("삭제 요청이 정상 처리되지 않았습니다.");
        }

        // 프론트 목록에서 바로 제거
        items.value = items.value.filter(item => item.news_id !== newsId);
    } catch(e) {
        const msg = e.response?.data?.error?.message;
        alert(msg);
    } finally {
        // deletingId null 처리
        deletingId.value = null;
    }
}
</script>