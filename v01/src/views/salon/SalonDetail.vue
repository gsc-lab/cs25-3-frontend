<template>
  <section class="page">
    <h2 class="page-title">SALON</h2>

    <div class="detail-container">
      <!-- 로딩 -->
      <p v-if="isLoading" class="msg">불러오는 중...</p>

      <!-- 서버 오류 메시지 -->
      <p v-else-if="errorServerMsg" class="msg msg-error">
        {{ errorServerMsg }}
      </p>

      <p v-else-if="!salon" class="msg">등록된 정보가 없습니다.</p>

      <article v-else class="salon-content">
        <div class="salon-main">
          <div class="salon-image">
            <!-- 이미지 -->
            <img
              v-if="salon.image"
              :src="salon.image"
              alt="salon image"
            />
            <div v-else class="image-placeholder">
              이미지가 없습니다.
            </div>
          </div>

          <div class="salon-intro">
            <!-- 소개 -->
            <h3 class="section-title">소개</h3>
            <p class="intro-text">
              {{ salon.introduction || '소개 정보가 없습니다.' }}
            </p>

            <div v-if="info" class="info-block">
              <!-- 정보 -->
              <h3 class="section-title">정보</h3>
              <ul class="info-list">
                <li v-if="info.phone"><span class="label">전화번호</span><span class="value">{{ info.phone }}</span></li>
                <li v-if="info.address"><span class="label">주소</span><span class="value">{{ info.address }}</span></li>
                <li v-if="info.opening_hour"><span class="label">영업시간</span><span class="value">{{ info.opening_hour }}</span></li>
                <li v-if="info.holiday"><span class="label">휴무일</span><span class="value">{{ info.holiday }}</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="salon-extra">
          <!-- 지도 -->
          <div v-if="salon.map" class="map-block">
            <h3 class="section-title">지도</h3>
            <div class="map-wrapper">
              <img
                :src="salon.map"
                alt="지도 이미지"
              />
            </div>
          </div>

          <div v-if="traffic" class="traffic-block">
            <h3 class="section-title">오시는 길</h3>
            <ul class="traffic-list">
              <li v-if="traffic.bus"><span class="label">버스</span><span class="value">{{ traffic.bus }}</span></li>
              <li v-if="traffic.parking"><span class="label">주차</span><span class="value">{{ traffic.parking }}</span></li>
              <li v-if="traffic.directions"><span class="label">길 안내</span><span class="value">{{ traffic.directions }}</span></li>
            </ul>
          </div>
        </div>

        <!-- 버튼 -->
        <div
          v-if="userStore.user.role === 'manager'"
          class="btn-row"
        >
          <!-- 수정 이동 버튼 -->
          <button
            type="button"
            class="btn-primary"
            @click="goUpdate"
          >
            수정하기
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { SalonApi } from '@/api/salon';

// 라우터 생성
const router = useRouter();

// 로그인 정보 불러오기
const userStore = useUserStore();

// 목록 변수
const salon = ref(null);
const info = ref(null);
const traffic = ref(null);

// 상태 관리 변수
const isLoading = ref(false);
const errorServerMsg = ref("");

// 미용실 정보 불러오기
const fetchDetail = async () => {
  // isLoading 활성화
  isLoading.value = true;

  // 서버 오류 메시지 초기화
  errorServerMsg.value = "";

  try {
    // SalonApi.list()
    const res = await SalonApi.list();
    const rawSalon = res?.data?.salon ?? null;
    salon.value = rawSalon;

    // 정보가 있다면
    if (rawSalon?.information) {
      try {
        info.value =
          typeof rawSalon.information === 'string'
            ? JSON.parse(rawSalon.information)
            : rawSalon.information;
      } catch {
        info.value = null;
      }
    }

    // 교통 정보가 있다면
    if (rawSalon?.traffic) {
      try {
        traffic.value =
          typeof rawSalon.traffic === 'string'
            ? JSON.parse(rawSalon.traffic)
            : rawSalon.traffic;
      } catch {
        traffic.value = null;
      }
    }
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value =
      e.response?.data?.error?.message || "서버 오류가 발생했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchDetail);

// 수정 페이지 이동 함수
const goUpdate = () => {
  router.push('/salon/update');
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

.msg {
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;
  color: #666;
}

.msg-error {
  color: #d9534f;
}

.salon-content {
  padding: 24px 20px 30px;
}

.salon-main {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
}

.salon-image {
  flex: 0 0 260px;
  max-width: 260px;
}

.salon-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #eee;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  border: 1px solid #eee;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

.salon-intro {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.intro-text {
  font-size: 14px;
  color: #444;
  margin-bottom: 16px;
}

.info-block,
.traffic-block,
.map-block {
  margin-top: 16px;
}

.info-list,
.traffic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li,
.traffic-list li {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
}

.label {
  flex: 0 0 70px;
  font-weight: 600;
  color: #555;
}

.value {
  flex: 1;
}

.salon-extra {
  padding-top: 24px;
}

.map-wrapper {
  margin-top: 8px;
}

.map-wrapper img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #eee;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary {
  padding: 10px 24px;
  font-size: 14px;
  background: #a8a6a4;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background: #cfbdaa;
}

@media (max-width: 768px) {
  .salon-main {
    flex-direction: column;
  }

  .salon-image {
    max-width: 100%;
  }
}
</style>
