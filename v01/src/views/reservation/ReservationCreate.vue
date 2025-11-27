<template>
  <div class="page">
    <h2>RESERVATION</h2>

    <form @submit.prevent="handleSubmit" class="items">
      <!-- 디자이너 선택 -->
      <div class="items-row">
        <label>디자이너</label>
        <select
          v-model="items.designer_id"
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
        <!-- 예약하기 -->
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
const isSubmitting = ref(false);
const errorServerMsg = ref("");

// 서비스 / 디자이너 목록 불러오기
const fetchList = async () => {
  try {
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
    // 서버 오류 저장
    console.error(e);
    errorServerMsg.value = "예약에 실패했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}

// 마이페이지 이동 함수
const goList = () => {
    router.push('/mypage');
}

</script>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.items-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.service-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.service-item {
  font-size: 14px;
}
textarea {
  min-height: 80px;
}
.buttons {
  flex-direction: row;
  gap: 8px;
  align-items: center;
}
.errorServerMsg {
  color: red;
}
</style>
