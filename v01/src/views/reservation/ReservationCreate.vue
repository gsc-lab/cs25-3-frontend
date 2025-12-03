<template>
  <div class="page">
    <h2 style="text-align: center;">RESERVATION</h2>

    <h3>디자이너 휴무일</h3>
    <div class="timeoff-list">
      <!-- timeoff table -->
      <table class="timeoff-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>시작</th>
            <th>종료</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="timeoffs.length === 0">
            <td colspan="4">등록된 휴무 정보가 없습니다.</td>
          </tr>
          <tr
            v-for="(to, index) in timeoffs"
            :key="to.to_id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ to.user_name }}</td>
            <td>{{ to.start_at }}</td>
            <td>{{ to.end_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <form @submit.prevent="handleSubmit" class="items">
      <!-- 디자이너 선택 -->
      <div class="items-row">
        <label>디자이너</label>
        <select
          v-model="items.designer_id"
          @change="designerDetail"
        >
          <option value="">선택</option>
          <option
            v-for="designer in designers"
            :key="designer.user_id"
            :value="designer.user_id"
          >
            {{ designer.user_name }}
          </option>
        </select>

        <!-- 선택된 디자이너의 예약 현황 테이블 -->
        <table
          v-if="items.designer_id"
        >
          <thead>
            <tr>
              <th>번호</th>
              <th>디자이너</th>
              <th>날짜</th>
              <th>시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(rv, index) in reservations"
              :key="rv.reservation_id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ rv.designer_name }}</td>
              <td>{{ rv.day }}</td>
              <td>{{ rv.start_at }} ~ {{ rv.end_at }}</td>
              <td>{{ rv.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 날짜 선택 -->
      <div class="items-row">
        <label>날짜</label>
        <input
          type="date"
          v-model="items.day"
          />
      </div>

      <!-- 시작 시간 선택 -->
      <div class="items-row">
        <label>시작 시간</label>
        <input
          type="time"
          v-model="items.start_at"
        />
      </div>

      <!-- 서비스 선택 -->
      <div class="items-row">
        <label>서비스 선택</label>
        <div class="service-list">
          <label
            v-for="service in services"
            :key="service.service_id"
            class="service-item"
          >
            <input
              type="checkbox"
              :value="service.service_id"
              v-model="items.service_id"
            />
            {{ service.service_name }}
            ({{ service.duration_min }}분)
          </label>
        </div>
      </div>

      <!-- 요구사항 -->
      <div class="items-row">
        <label>요청사항</label>
        <textarea
          v-model="items.requirement"
          placeholder="ex) 앞머리는 눈썹 위로 잘라주세요."
        ></textarea>
      </div>

      <!-- 버튼 -->
      <div class="items-row buttons">
        <!-- 예약 버튼 -->
        <SubmitButton>
          예약하기
        </SubmitButton>

        <!-- 목록 이동 -->
        <button
          type="button"
          @click="goList"
        >
          목록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ReservationApi } from "@/api/reservation";
import { ServiceApi } from "@/api/service";
import { DesignerApi } from "@/api/designer";
import { TimeoffApi } from '@/api/timeoff';
import { useUserStore } from "@/stores/user";
import SubmitButton from "@/components/SubmitButton.vue";

// 라우터 생성
const router = useRouter();

// 사용자 정보 변수 저장
const userStore = useUserStore();
const role = userStore.user.role;

// client만 예약 페이지 입장 가능
if (role !== "client") {
  // guest일 경우 로그인 페이지 이동
  alert("예약은 클라이언트만 가능합니다. 마이페이지로 이동합니다.");
  router.push("/mypage");
}

// 입력 레이어
const items = ref({
  designer_id: "",
  day: "",
  start_at: "",
  service_id: [],
  requirement: "",
});

// 상태 관리 변수
const services = ref([]);
const designers = ref([]);
const reservations = ref([]);
const timeoffs = ref([]);
const isSubmitting = ref(false);
const errorServerMsg = ref("");

// 서비스 / 디자이너 목록 불러오기
const fetchList = async () => {
  try {
    // 휴무 정보 가져오기
    const bodyTimeoff = await TimeoffApi.list();
    timeoffs.value = bodyTimeoff?.data?.timeoff;

    // 서비스 정보 가져오기
    const resService = await ServiceApi.list();
    const bodyService = resService.data;
    services.value = bodyService?.data?.service;

    // 디자이너 정보 가져오기
    const resDesigner = await DesignerApi.list();
    const bodyDesigner = resDesigner.data;
    designers.value = bodyDesigner?.data?.designer;

  } catch(e) {
    // 서버 오류 저장
    console.error(e);
    errorServerMsg.value = "서비스/디자이너 정보를 불러오지 못했습니다.";
  }
}

onMounted(fetchList);

// 유효성 검사
const validate = () => {
  if (!items.value.designer_id) return "디자이너를 선택해 주세요.";
  if (!items.value.day) return "날짜를 선택해 주세요.";
  if (!items.value.start_at) return "시작 시간을 입력해 주세요.";
  if (!items.value.service_id.length) return "서비스를 최소 1개 이상 선택해 주세요.";
  if (!items.value.requirement) return "요청사항을 입력해 주세요.";
  return "";
}

// 제출
const handleSubmit = async () => {
  // 빈 입력창이 있을 경우
  // 오류 메시지 출력
  if (validate()) {
    errorServerMsg.value = validate();
    alert(errorServerMsg.value);
    return;
  }

  // 빈 입력창이 없을 경우
  // 제출 로직 실행
  try {
    // isSubmitting 활성화
    isSubmitting.value = true;

    // 오류 메시지 초기화
    errorServerMsg.value = "";

    // payload
    const payload = {
      designer_id: items.value.designer_id,
      day: items.value.day,
      start_at: items.value.start_at,
      service_id: items.value.service_id,
      requirement: items.value.requirement,
    };

    // ReservationApi.create(payload)
    const res = await ReservationApi.create(payload);
    const body = res.data;
    console.log(body);
    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // 예약 성공 시 메시지 출력
    alert("예약이 완료되었습니다.");

    // 예약 목록 페이지 이동
    router.push("/mypage");
  } catch (e) {
    // 서버 오류 메시지 출력
    console.error(e);
    errorServerMsg.value = e?.response?.data?.error?.message;
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}

// 특정 디자이너 예약 정보 불러오기
const designerDetail = async () => {
  // ReservationApi.designerDetail(user_id.value)
  const res = await ReservationApi.designerDetail(items.value.designer_id);
  const body = res.data;

  // reservations 변수에 불러온 정보 저장
  reservations.value = body?.data?.reservation;
}

// 마이페이지 이동 함수
const goList = () => {
    router.push('/mypage');
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

.page h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
}

p[v-if="isLoading"] {
  margin: 10px 0;
}

.timeoff-list {
  margin-bottom: 24px;
}

.timeoff-table,
.items table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 14px;
}

.timeoff-table th,
.timeoff-table td,
.items table th,
.items table td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  text-align: center;
}

.timeoff-table thead,
.items table thead {
  background-color: #f5f5f5;
}

.timeoff-table tbody tr:nth-child(even),
.items table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}

.items-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.items-row > label {
  font-weight: 600;
}

.items-row input[type="date"],
.items-row input[type="time"],
.items-row select,
.items-row textarea {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  max-width: 260px;
}

.items-row textarea {
  min-height: 80px;
  max-width: 100%;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-item {
  font-size: 14px;
}

.buttons {
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.buttons > button {
  padding: 8px 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.buttons > button:hover {
  background-color: #f0f0f0;
}

.errorServerMsg {
  color: #d9534f;
  font-size: 13px;
}

@media (max-width: 600px) {
  .page {
    padding: 0 10px;
  }

  .items-row input[type="date"],
  .items-row input[type="time"],
  .items-row select {
    max-width: 100%;
  }
}
</style>

