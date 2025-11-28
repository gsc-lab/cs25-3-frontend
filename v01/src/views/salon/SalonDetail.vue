<template>
  <section>
    <h2>Salon 정보</h2>

    <!-- 로딩 -->
    <p v-if="isLoading">불러오는 중...</p>

    <!-- 서버 오류 -->
    <p v-if="errorServerMsg">
      {{ errorServerMsg }}
    </p>

    <!-- 내용 렌더링 -->
    <article v-else-if="salon">
      <!-- 대표 이미지 -->
      <img
        v-if="salon.image"
        :src="salon.image"
        alt="salon image"
        style="max-width:300px; display:block; margin-bottom:16px"
      />

      <!-- 소개 -->
      <p>
        <strong>소개:</strong>
        {{ salon.introduction }}
      </p>

      <!-- 정보(JSON 파싱) -->
      <div v-if="info">
        <p><strong>정보:</strong></p>
        <ul>
          <li v-if="info.phone">전화번호: {{ info.phone }}</li>
          <li v-if="info.address">주소: {{ info.address }}</li>
          <li v-if="info.opening_hour">영업시간: {{ info.opening_hour }}</li>
          <li v-if="info.holiday">휴무일: {{ info.holiday }}</li>
        </ul>
      </div>

      <!-- 지도 -->
      <p v-if="salon.map">
        <strong>지도:</strong>
        <img
          :src="salon.map"
          alt="이미지 없음"
          style="width: 300px;"
        >
      </p>

      <!-- 오시는 길(JSON 파싱) -->
      <div v-if="traffic">
        <p><strong>오시는 길:</strong></p>
        <ul style="margin-left: 1rem">
          <li v-if="traffic.bus">버스: {{ traffic.bus }}</li>
          <li v-if="traffic.parking">주차: {{ traffic.parking }}</li>
          <li v-if="traffic.directions">길 안내: {{ traffic.directions }}</li>
        </ul>
      </div>

      <!-- 수정 버튼 -->
      <button
        v-if="userStore.user.role === 'manager'"
        type="button"
        @click="goUpdate"
      >
        수정하기
      </button>
    </article>

    <!-- 데이터 없음 -->
    <p v-else>등록된 정보가 없습니다.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { SalonApi } from '@/api/salon';

// 라우터 생성
const router = useRouter();

// 사용자 정보 변수에 저장하기
const userStore = useUserStore();

// 입력창 변수
const salon = ref(null);
const info = ref(null);
const traffic = ref(null);

// 상태 관리 변수
const isLoading = ref(false);
const errorServerMsg = ref("");

// 상세 조회
const fetchDetail = async () => {
  isLoading.value = true;
  errorServerMsg.value = "";

  try {
    // salon 정보 요청
    const res = await SalonApi.list();
    const rawSalon = res?.data?.salon ?? null;
    salon.value = rawSalon;

    // information JSON 파싱
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

    // traffic JSON 파싱
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
    errorServerMsg.value =
      e.response?.data?.error?.message || "서버 오류가 발생했습니다.";
  } finally {
    isLoading.value = false;
  }
};

// 초기 로딩
onMounted(fetchDetail);

// 수정 페이지 이동
const goUpdate = () => {
  router.push('/salon/update');
};
</script>
