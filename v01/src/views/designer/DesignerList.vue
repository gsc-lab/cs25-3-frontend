<template>
  <article class="page">
    <h2>DESIGNER</h2>

    <!-- 로딩 -->
    <p v-if="isLoading" class="msg">불러오는 중...</p>

    <!-- 서버 오류 메시지 -->
    <p v-else-if="errorServerMsg" class="msg error">
      {{ errorServerMsg }}
    </p>

    <!-- 등록된 디자이너가 없을 경우 -->
    <p v-else-if="items.length === 0" class="msg">
      등록된 디자이너가 없습니다.
    </p>

    <!-- 이미지 (CRUD) -->
    <div v-else class="gallery-grid">
      <article
        v-for="item in items"
        :key="item.designer_id"
        class="designer-card"
      >
        <div class="image-box">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.user_name"
          />
          <div v-else class="no-image">이미지 없음</div>

          <div class="overlay">
            <h3 class="designer-name">
              {{ item.user_name }}
            </h3>

            <div class="designer-meta">
              <p v-if="item.experience">경력: {{ item.experience }}년</p>
              <p v-if="item.good_at">특기: {{ item.good_at }}</p>
              <p v-if="item.personality">성격: {{ item.personality }}</p>
            </div>

            <p v-if="item.message" class="designer-message">
              "{{ item.message }}"
            </p>

            <div class="actions">
              <button
                v-if="userStore.user.user_id === item.user_id"
                type="button"
                @click.stop="goUpdate(item.designer_id)"
              >
                수정
              </button>
              <button
                v-if="userStore.user.role === 'manager'"
                type="button"
                class="btn-danger"
                @click.stop="handleDelete(item.designer_id)"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 디자이너 등록 버튼 -->
    <div
      v-if="userStore.user.role === 'designer'"
      class="action-row"
    >
      <button
        type="button"
        class="btn-primary"
        @click="goCreate"
      >
        디자이너 등록
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DesignerApi } from '@/api/designer';
import { useUserStore } from '@/stores/user';

// 라우터 생성
const router = useRouter();

// 로그인 정보 불러오기
const userStore = useUserStore();

// 목록 변수
const items = ref([]);
const isLoading = ref(false);

// 상태 관리 변수
const deleting = ref('');
const errorServerMsg = ref('');

// 디자이너 정보 불러오기
const fetchList = async () => {
  // 서버 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // DesignerApi.list()
    const res = await DesignerApi.list();
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // items에 불러온 정보 저장
    items.value = body.data.designer;
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchList);

// 디자이너 삭제
const handleDelete = async (designer_id) => {
  // 삭제 여부
  const ok = confirm('해당 디자이너 정보를 삭제하시겠습니까?');
  if (!ok) return;

  // 서버 오류 메시지 출력
  errorServerMsg.value = '';

  // deleting 활성화
  deleting.value = true;

  try {
    // DesignerApi.delete(designer_id)
    const res = await DesignerApi.delete(designer_id);
    const status = res.status;

    // response.status가 204가 아닌 경우
    // 에러 메시지 던지기
    if (status !== 204) {
      throw new Error(res.data?.error?.message);
    }

    // 삭제된 이미지 필터링
    items.value = items.value.filter(
      (item) => item.designer_id !== designer_id
    );

    // 성공 메시지 출력
    alert('삭제 성공!');
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // deleting 비활성화
    deleting.value = false;
  }
};

// 디자이너 등록 페이지 이동 함수
const goCreate = () => {
  router.push('/designer/create');
};

// 디자이너 수정 페이지 이동 함수
const goUpdate = (designer_id) => {
  router.push(`/designer/update/${designer_id}`);
};
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

.page > h2 {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}

.msg {
  text-align: center;
  padding: 40px;
  font-size: 14px;
  color: #666;
}

.msg.error {
  color: #d9534f;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.designer-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #eee;
  aspect-ratio: 3 / 4;
}

.image-box {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-box img {
  width: auto;
  height: 100%;
  object-fit: cover;
  min-width: 100%;
  min-height: 100%;
  transition: transform 0.35s ease;
}

.no-image {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 13px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px 14px;
  box-sizing: border-box;
  transition: opacity 0.3s ease;
}

.designer-card:hover .overlay {
  opacity: 1;
}

.designer-card:hover img {
  transform: scale(1.1);
}

.designer-name {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 6px 0;
}

.designer-meta {
  font-size: 12px;
  color: #ddd;
}

.designer-meta p {
  margin: 0;
}

.designer-message {
  margin: 8px 0 12px;
  font-size: 12px;
  color: #f5f5f5;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background-color: #fff;
  color: #333;
  transition: background-color 0.2s ease;
}

.actions button:hover {
  background-color: #f0f0f0;
}

.btn-danger {
  color: #d9534f;
}

.btn-danger:hover {
  background-color: #fff0f0;
}

.action-row {
  text-align: center;
  margin-top: 20px;
}

.btn-primary {
  padding: 12px 30px;
  font-size: 14px;
  background: #a8a6a4;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background: #cfbdaa;
}

@media (max-width: 768px) {
  .msg {
    padding: 20px;
  }
}
</style>
