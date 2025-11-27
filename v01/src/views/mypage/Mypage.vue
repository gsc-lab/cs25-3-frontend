<template>
  <div class="page">
    <h2>MYPAGE</h2>

    <!-- 로딩 중 -->
    <div v-if="isLoading">불러오는 중...</div>

    <!-- 서버 오류 메시지가 있을 경우 -->
    <!-- 에러 메시지 출력 -->
    <div v-else-if="errorServerMsg" class="error">{{ errorServerMsg }}</div>
    <div v-else-if="reservations.length === 0">
      예약이 없습니다.
    </div>

    <!-- 예약이 있을 경우 -->
    <table v-else class="rv-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>디자이너</th>
          <th>고객</th>
          <th>서비스</th>
          <th>날짜</th>
          <th>시간</th>
          <th>상태</th>
          <th>합계</th>
          <th>취소사유</th>
          <th>변경</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(rv, index) in reservations"
          :key="rv.reservation_id"
        >
          <!-- 번호 -->
          <td>{{ index + 1 }}</td>
          <!-- 디자이너 -->
          <td>{{ rv.designer_name }}</td>
          <!-- 고객 -->
          <td>{{ rv.client_name }}</td>
          <!-- 서비스 목록 -->
          <td>
            <ul class="service-list">
              <li
                v-for="(name, index) in rv.services"
                :key="index"
              >
                {{ name }}
              </li>
            </ul>
          </td>
          <!-- 날짜 -->
          <td>{{ rv.day }}</td>
          <!-- 시간 -->
          <td>{{ rv.start_at }} ~ {{ rv.end_at }}</td>
          <!-- 상태 -->
          <td>{{ rv.status }}</td>
          <!-- 합계 -->
          <td>{{ rv.total_price.toLocaleString() }}원</td>
          <!-- 취소사유 -->
          <td>
            <div v-if="rv.cancel_reason">
              <p class="cancel-info">
                취소 사유: {{ rv.cancel_reason }}
                <br />
                취소 시각: {{ rv.cancelled_at }}
              </p>
            </div>
          </td>
          <!-- 변경 -->
          <td>
            <!-- client: 예약 취소 버튼 -->
            <button
              v-if="role === 'client' && canCancel(rv)"
              @click="handleCancel(rv)"
            >
              취소
            </button>

            <!-- designer: 상태 변경 select -->
            <div v-if="role === 'designer'">
              <select v-model="rv._statusDraft">
                <option value="pending">대기</option>
                <option value="confirmed">확정</option>
                <option value="completed">완료</option>
                <option value="no_show">노쇼</option>
                <option value="cancelled">취소</option>
              </select>
              <button @click="handleChangeStatus(rv)">변경</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { ReservationApi } from "@/api/reservation";

// 사용자 정보 가져오기
const userStore = useUserStore();
const role = userStore.user.role;

// 예약 목록 변수
const reservations = ref([]);

// 상태 관리 변수
const isLoading = ref(false);
const errorServerMsg = ref("");

// 목록 불러오기
const fetchList = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = "";

  // isLoading 활성화
  isLoading.value = true;

  try {
    // 예약 목록 불러오기
    const res = await ReservationApi.list();
    const body = res.data;
    reservations.value = body?.reservation;
  } catch (e) {
    // 서버 오류 출력
    console.error(e);
    errorServerMsg.value = "예약 정보를 불러오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchList);

// client가 취소할 수 있는지 판단
const canCancel = (rv) => {
  return rv.status === "pending" ||
         rv.status === "confirmed";
}

// 예약 취소
const handleCancel = async (rv) => {
  // 취소 사유는 prompt로 작성
  // 취소 누를 시 취소 함수 종료
  const reason = prompt("취소 사유를 입력해 주세요.");
  if (!reason) return;

  try {
    // ReservationApi.cancel(reservation.reservation_id, reason)
    await ReservationApi.cancel(
        rv.reservation_id,
        reason
    );

    // 예약 취소 성공 메시지
    alert("예약이 취소되었습니다.");

    // 예약 취소 후 목록 다시 불러오기
    await fetchList();
  } catch (e) {
    // 취소 실패
    console.error(e);
    alert("취소에 실패했습니다.");
  }
}

// 디자이너가 상태 변경
async function handleChangeStatus(rv) {
  if (rv._statusDraft === rv.status) {
    alert("변경된 내용이 없습니다.");
    return;
  }
  // 예약 상태 변경 확인
  // 취소 시 로직 종료
  const ok = confirm(
    `예약 상태를 '${rv.status}' → '${rv._statusDraft}' 로 변경할까요?`
  );
  if (!ok) return;

  // 디자이너 상태 변경
  try {
    // ReservationApi.updateStatus(rv.reservation_id, rv._statusDraft)
    await ReservationApi.updateStatus(rv.reservation_id, rv._statusDraft);
    alert("상태가 변경되었습니다.");
    
    // 예약 상태 변경 후 목록 불러오기
    await fetchList();
  } catch (e) {
    console.error(e);
    alert("상태 변경에 실패했습니다.");
  }
}
</script>


<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
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
  padding: 6px 8px;
  font-size: 14px;
}
.service-list {
  padding-left: 18px;
  margin: 0;
}
.cancel-info {
  font-size: 12px;
  color: #888;
}
.error {
  color: red;
}
</style>
