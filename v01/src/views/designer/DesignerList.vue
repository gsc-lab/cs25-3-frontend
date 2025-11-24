<template>
  <article>
    <h2>디자이너 소개</h2>

    <p v-if="items.length === 0">등록된 디자이너가 없습니다.</p>
    <div
      class="info"
      v-for="item in items"
      :key="item.designer_id"
    >
      <hr>
      <!-- 이미지 -->
      <img
        :src="item.image"
        alt="준비 중입니다."
        style="width: 200px; height: 300px; object-fit: cover;"
      >

      <!-- 이름 -->
      <p>이름: {{ item.user_name }}</p>
      <p>경력: {{ item.experience }}년</p>
      <p>특기: {{ item.good_at }}</p>
      <p>성격: {{ item.personality }}</p>
      <p>메시지: {{ item.message }}</p>
      <p></p>

      <div v-if="userStore.user.user_id === item.user_id" class="button">
        <!-- 수정 버튼 -->
        <button
          type="button"
          @click="goUpdate(item.designer_id)"
        >
          수정
        </button>
        <button
          type="button"
          @click="handleDelete(item.designer_id)"
        >
          삭제
        </button>
      </div>
      
    </div> <hr>
    <!-- 등록 버튼 -->
    <button
      v-if="userStore.user.role === 'designer'"
      type="button"
      @click="goCreate"
    >
      등록
    </button>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DesignerApi } from '@/api/designer';
import { useUserStore } from '@/stores/user';

// 라우터 설정
const router = useRouter();

// 로그인 정보 가져오기
const userStore = useUserStore();

// 디자이너 정보
const items = ref([]);

// 상태 관리 변수
const isLoading = ref(false);
const deleting = ref('');
const errorServerMsg = ref('');

// 정보 불러오기
const fetchList = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = "";

  // isLoading 활성화
  isLoading.value = true;

  try {
    // 디자이너 정보 불러오기
    const res = await DesignerApi.list();
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // items에 디자이너 정보 저장
    items.value = body.data.designer;

  } catch(e) {
    // 서버 오류 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

onMounted(fetchList);

// 디자이너 삭제 함수
const handleDelete = async (designer_id) => {
  // 오류 메시지 초기화
  errorServerMsg.value = "";

  // deleting 활성화
  deleting.value = true;

  try {
    // delete 로직
    const res = await DesignerApi.delete(designer_id);
    const status = res.status;
    // response.data.success가 false인 경우
    // 에러 던지기
    if (status !== 204) {
      throw new Error(res.data?.error?.message);
    }

    // items에서 해당 게시물만 삭제
    items.value = items.value.filter(item => item.designer_id !== designer_id);

    // 삭제 성공 시
    alert("삭제 성공!");
  } catch(e) {
    // 서버 오류 출력
    errorServerMsg.value = e.response?.data?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // deleting 비활성화
    deleting.value = false;
  }
}

// 디자이너 등록 페이지 이동 함수
const goCreate = () => {
  router.push('/designer/create');
}

// 디자이너 수정 페이지 이동 함수
const goUpdate = (designer_id) => {
  router.push(`/designer/update/${designer_id}`);
}
</script>