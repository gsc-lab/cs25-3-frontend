<template>
  <div class="page">
    <h2 style="text-align: center;">MYPAGE</h2>

    <!-- 예약 이력 -->
    <h3>예약 이력</h3>

    <!-- 로딩 / 에러 / 빈 목록 -->
    <div v-if="isLoading" class="info-text">불러오는 중...</div>
    <div v-else-if="errorServerMsg" class="error-text">{{ errorServerMsg }}</div>
    <div v-else-if="reservations.length === 0" class="info-text">
      예약 이력이 없습니다.
    </div>

    <!-- 예약 목록 테이블 -->
    <table v-else class="rv-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>디자이너</th>
          <th>고객</th>
          <th>서비스</th>
          <th>요구사항</th>
          <th>날짜</th>
          <th>시간</th>
          <th>상태</th>
          <th>합계</th>
          <th>취소사유</th>
          <th>작성일자</th>
          <th>수정일자</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(rv, index) in reservations"
          :key="rv.reservation_id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ rv.designer_name }}</td>
          <td>{{ rv.client_name }}</td>
          <td class="cell-service">
            <ul class="service-list">
              <li
                v-for="(sv, i) in rv.services"
                :key="i"
              >
                {{ sv }}
              </li>
            </ul>
          </td>
          <td class="cell-requirement">{{ rv.requirement }}</td>
          <td>{{ rv.day }}</td>
          <td>{{ rv.start_at }} ~ {{ rv.end_at }}</td>
          <td>{{ rv.status }}</td>
          <td>{{ rv.total_price.toLocaleString() }}원</td>
          <td class="cell-cancel">{{ rv.cancel_reason }}</td>
          <td>{{ rv.created_at }}</td>
          <td>{{ rv.updated_at }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 마이페이지 이동 버튼 -->
    <button
       type="button"
      @click="goMypage"
    >
      마이페이지
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ReservationApi } from '@/api/reservation.js';

// 라우터 생성
const router = useRouter();

// 목록 변수
const reservations = ref([]);

// 상태 관리 변수
const isLoading = ref(false);
const errorServerMsg = ref('');

// 예약 정보 불러오기
const fetchList = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // ReservationApi.previousList()
    const res = await ReservationApi.previousList();
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // reservations 변수에 불러온 정보 저장
    const list = body?.data?.reservation ?? [];
    reservations.value = list;
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchList);

// 마이페이지 이동 함수 (필요하면 사용)
const goMypage = () => {
  router.push('/mypage');
};
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

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.rv-table {
  width: 100%;
  border-collapse: collapse;
}
.rv-table th,
.rv-table td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  font-size: 14px;
}
.service-list {
  padding-left: 18px;
  margin: 0;
}
table thead {
  background-color: #f5f5f5;
}
button {
  display: inline-block;
  padding: 8px 14px;
  margin-right: 10px;
  margin-top: 10px;

  background: #a8a6a4;
  color: white;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #cfbdaa;
}

.cancel-info {
  font-size: 12px;
  color: #888;
}
.error {
  color: red;
}
</style>
