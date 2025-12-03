<template>
  <section class="page">
    <h2>SALON</h2>

    <div class="form-container">
      <!-- 로딩 -->
      <p v-if="isLoading" class="msg">불러오는 중...</p>

      <!-- 서버 오류 메시지 -->
      <p v-else-if="errorServerMsg" class="msg msg-error">
        {{ errorServerMsg }}
      </p>

      <!-- form -->
      <form v-else @submit.prevent="handleUpdate">
        <fieldset class="field-group">
          <!-- 소개 -->
          <div class="input-wrapper">
            <FormField
              label="소개"
              name="introduction"
              placeholder="살롱 소개를 입력하세요."
              v-model="introduction"
            />
          </div>

          <!-- 정보 -->
          <p class="section-title">정보</p>

          <div class="input-wrapper">
            <!-- 전화번호 -->
            <FormField
              label="전화번호"
              name="phone"
              placeholder="전화번호를 입력하세요."
              v-model="phone"
            />
          </div>

          <div class="input-wrapper">
            <!-- 주소 -->
            <FormField
              label="주소"
              name="address"
              placeholder="주소를 입력하세요."
              v-model="address"
            />
          </div>

          <div class="input-wrapper">
            <!-- 영업시간 -->
            <FormField
              label="영업시간"
              name="opening_hour"
              placeholder="예) 10:00 - 19:00"
              v-model="opening_hour"
            />
          </div>

          <div class="input-wrapper">
            <!-- 휴무일 -->
            <FormField
              label="휴무일"
              name="holiday"
              placeholder="예) 일요일"
              v-model="holiday"
            />
          </div>

          <!-- 오시는 길 -->
          <p class="section-title">오시는 길</p>

          <div class="input-wrapper">
            <!-- 교통 -->
            <FormField
              label="버스"
              name="bus"
              placeholder="예) 706, 719, 730, 북구2"
              v-model="bus"
            />
          </div>

          <div class="input-wrapper">
            <!-- 주차 -->
            <FormField
              label="주차"
              name="parking"
              placeholder="주차 안내를 입력하세요."
              v-model="parking"
            />
          </div>

          <div class="input-wrapper">
            <!-- 길 안내 -->
            <FormField
              label="길 안내"
              name="directions"
              placeholder="도보/길 안내를 입력하세요."
              v-model="directions"
            />
          </div>

          <!-- 이미지 업로드 -->
          <div class="input-wrapper">
            <label>대표 이미지 변경 (선택)</label>
            <input type="file" @change="onFileChange" />
          </div>
        </fieldset>

        <!-- 버튼 -->
        <div class="btn-group">
          <!-- 수정 버튼 -->
          <SubmitButton :loading="isSubmitting">
            수정하기
          </SubmitButton>

          <!-- 뒤로가기 버튼 -->
          <button
            type="button"
            class="btn-secondary"
            @click="goDetail"
          >
            뒤로가기
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SalonApi } from "@/api/salon";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

// 라우터 생성
const router = useRouter();

// 입력 및 목록 변수
const introduction = ref("");
const phone = ref("");
const address = ref("");
const opening_hour = ref("");
const holiday = ref("");
const bus = ref("");
const parking = ref("");
const directions = ref("");
const imageFile = ref(null);

// 상태 관리 변수
const isSubmitting = ref(false);
const isLoading = ref(false);
const errorServerMsg = ref("");
const successMsg = ref("");

// 목록 불러오기
const fetchDetail = async () => {
  // isLoading 활성화
  isLoading.value = true;

  // 서버 오류 메시지 초기화
  errorServerMsg.value = "";

  try {
    // SalonApi.list()
    const res = await SalonApi.list();
    const rawSalon = res?.data?.salon ?? null;

    // 미용실 정보가 없다면 함수 종료
    if (!rawSalon) return;

    // 소개
    introduction.value = rawSalon.introduction || "";

    // 미용실 정보가 있을 경우
    if (rawSalon.information) {
      try {
        const info =
          typeof rawSalon.information === "string"
            ? JSON.parse(rawSalon.information)
            : rawSalon.information;

        phone.value = info.phone || "";
        address.value = info.address || "";
        opening_hour.value = info.opening_hour || "";
        holiday.value = info.holiday || "";
      } catch {
        // 값 초기화
        phone.value = "";
        address.value = "";
        opening_hour.value = "";
        holiday.value = "";
      }
    }

    // 미용실 교통 정보가 있을 경우
    if (rawSalon.traffic) {
      try {
        const tf =
          typeof rawSalon.traffic === "string"
            ? JSON.parse(rawSalon.traffic)
            : rawSalon.traffic;

        bus.value = tf.bus || "";
        parking.value = tf.parking || "";
        directions.value = tf.directions || "";
      } catch {
        // 값 초기화
        bus.value = "";
        parking.value = "";
        directions.value = "";
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

// 파일 올리기
const onFileChange = (e) => {
  imageFile.value = e.target.files[0] || null;
};

// 미용실 정보 수정
const handleUpdate = async () => {
  // 서버 오류 메시지 초기화
  errorServerMsg.value = "";

  // 성공 메시지 초기화
  successMsg.value = "";

  // isSubmitting 활성화
  isSubmitting.value = true;

  try {
    // 미용실 정보
    const infoObj = {
      phone: phone.value,
      address: address.value,
      opening_hour: opening_hour.value,
      holiday: holiday.value,
    };

    // 교통 정보
    const trafficObj = {
      bus: bus.value,
      parking: parking.value,
      directions: directions.value,
    };

    // payload
    const payload = {
      introduction: introduction.value,
      information: infoObj,
      traffic: trafficObj,
    };

    // formData 생성
    const formData = new FormData();
    // 이미지 파일이 있으면
    if (imageFile.value) {
      formData.append("image", imageFile.value);
      // SalonApi.updateImage(formData)
      await SalonApi.updateImage(formData);
    }

    // SalonApi.update(payload)
    await SalonApi.update(payload);

    // 성공 메시지 출력 후 미용실 소개 페이지 이동
    successMsg.value = "수정이 완료되었습니다.";
    alert(successMsg.value);
    router.push("/salon");
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value =
      e.response?.data?.error?.message || "수정 중 오류가 발생했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
};

// 미용실 소개 페이지 이동 함수
const goDetail = () => {
  router.push("/salon");
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

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}

.field-group {
  border: none;
  padding: 0;
  margin: 0;
}

.input-wrapper {
  margin-bottom: 22px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 18px 0 8px;
  color: #333;
}

:deep(label) {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

:deep(input[type="text"]),
:deep(input[type="tel"]),
:deep(input[type="url"]) {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

:deep(input:focus) {
  outline: none;
  border-color: #a8a6a4;
}

input[type="file"] {
  font-size: 13px;
}

.msg {
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  color: #666;
}

.msg-error {
  color: #d9534f;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
}

button,
:deep(button) {
  display: inline-block;
  min-width: 100px;
  padding: 10px 20px;
  background: #a8a6a4;
  color: #fff;
  border: 1px solid #a8a6a4;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

button:hover,
:deep(button:hover) {
  background: #cfbdaa;
  border-color: #cfbdaa;
}

.btn-secondary {
  background: #fff;
  color: #555;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background: #f0f0f0;
  border-color: #bbb;
  color: #333;
}

:deep(button:disabled) {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
}
</style>
