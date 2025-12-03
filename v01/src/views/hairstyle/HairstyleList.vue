<template>
  <section class="page">
    <h2>HAIRSTYLE</h2>

    <!-- 로딩 -->
    <p v-if="isLoading" class="msg">불러오는 중...</p>

    <!-- 서버 오류 메시지 -->
    <p v-else-if="errorMessage" class="msg error">{{ errorMessage }}</p>

    <!-- 헤어스타일 정보가 없을 경우 -->
    <p v-else-if="items.length === 0" class="msg">등록된 헤어스타일이 없습니다.</p>

    <div v-else class="gallery-grid">
      <article
        v-for="item in items"
        :key="item.hair_id"
        class="hair-card"
      >
        <!-- 이미지 박스 -->
        <div class="image-box">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
          />
          <div v-else class="no-image">No Image</div>
          
          <div class="overlay">
            <!-- 이미지 제목 -->
            <h3
              class="hair-title"
              @click="router.push(`/hairstyle/${item.hair_id}`)"
            >
              {{ item.title }}
            </h3>
            
            <div 
              v-if="userStore.user.role === 'manager'"
              class="actions"
            >
              <!-- 수정 버튼 -->
              <button
                type="button"
                @click.stop="goUpdate(item.hair_id)"
              >
                수정
              </button>

              <!-- 삭제 버튼 -->
              <button
                type="button"
                class="btn-danger"
                :disabled="deletingId === item.hair_id"
                @click.stop="handleDelete(item.hair_id)"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 헤어스타일 등록 페이지 이동 버튼 -->
    <div class="action-row" v-if="userStore.user.role === 'manager'">
      <button
        type="button"
        class="btn-primary"
        @click="goCreate"
      >
        헤어스타일 등록
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HairstyleApi } from "@/api/hairstyle";
import { useUserStore } from "@/stores/user";

// 로그인 정보 불러오기
const userStore = useUserStore();

// 라우터 생성
const router = useRouter();

// 목록 데이터 변수
const items = ref([]);

// 상태 관리 변수
const isLoading = ref(false);    // 로딩 상태
const errorMessage = ref("");    // 에러 메시지
const deletingId = ref(null);    // 현재 삭제 중인 ID

// 목록 조회
const fetchList = async () => {
  // isLoading 활성화
  isLoading.value = true;

  // 서버 오류 메시지 초기화
  errorMessage.value = "";

  try {
    // HairstyleApi.list()
    const res = await HairstyleApi.list();
    items.value = res.data?.hairstyle ?? [];
  } catch (e) {
    // 서버 오류 메시지 출력
    errorMessage.value = e.response?.data?.error?.message || "목록을 불러오지 못했습니다.";
    alert(errorMessage.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchList);

// 삭제 처리
const handleDelete = async (hairId) => {
  // 삭제 여부
  const ok = confirm("정말 삭제하시겠습니까?");
  if (!ok) return;

  try {
    deletingId.value = hairId;

    // HairstyleApi.delete(hairId)
    const res = await HairstyleApi.delete(hairId);
    const status = res?.status ?? res;

    // response.status가 200 혹은 204일 경우
    // 에러 메시지 던지기
    if (status !== 204 && status !== 200) {
      throw new Error("삭제 실패");
    }

    // 프론트 목록에서 제거
    items.value = items.value.filter(item => item.hair_id !== hairId);
  } catch (e) {
    // 서버 오류 메시지 출력
    const msg = e.response?.data?.error?.message || "삭제 중 오류가 발생했습니다.";
    alert(msg);
  } finally {
    // deletingId 초기화
    deletingId.value = null;
  }
};

// 헤어스타일 등록 페이지 이동 함수 정의
const goCreate = () => {
  router.push('/hairstyle/create');
}

// 헤어스타일 수정 페이지 이동 함수 정의
const goUpdate = (hairId) => {
  router.push(`/hairstyle/update/${hairId}`);
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

.msg {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #666;
}
.msg.error {
    color: #d9534f;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.hair-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    background-color: #eee;
    aspect-ratio: 3 / 4; 
}

.image-box {
    width: 100%;
    height: 100%;
    position: relative;
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}

.no-image {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e0e0e0;
    color: #888;
    font-size: 14px;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
    padding: 20px;
    box-sizing: border-box;
}

.hair-card:hover .overlay {
    opacity: 1;
}

.hair-card:hover img {
    transform: scale(1.05);
}

.hair-title {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    text-align: center;
}

.actions {
    display: flex;
    gap: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  border: none;
  background-color: #fff;
  color: #333;
  transition: all 0.2s ease;
}

button:hover {
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
    margin-top: 40px;
}

.btn-primary {
  padding: 12px 30px;
  font-size: 15px;
  background: #a8a6a4;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background: #cfbdaa;
}

.hair-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.hair-title:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

</style>