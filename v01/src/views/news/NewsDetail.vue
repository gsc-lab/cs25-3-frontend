<template>
  <article>
    <h2>공지사항 보기</h2>

    <p v-if="isLoading">불러오는 중...</p>
    <div v-else class="notice">
      <fieldset>
        <!-- 제목 -->
        <p><label>제목: </label>{{ item.title }}</p>

        <!-- 작성일 -->
        <p><label>작성일: </label>{{ item.created_at }}</p>

        <!-- 수정일(없으면 미출력) -->
        <p v-if="item.updated_at"><label>수정일: </label>{{ item.updated_at }}</p>

        <!-- 이미지 -->
        <img v-if="item.file" :src="item.file" alt="이미지 오류">

        <!-- 내용 -->
        <p>{{ item.content }}</p>
      </fieldset>
      <button
        type="button"
        @click="goList"
      >
        목록
      </button>
    </div>
    
    <!-- 목록 이동 버튼 -->
  </article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NewsApi } from '@/api/news';

// 라우트, 라우터 생성
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
        // 서버 오류 메시지
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