<template>
  <section class="page">
    <h2>SERVICE</h2>

    <!-- form -->
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <fieldset class="field-group">
          <div class="input-wrapper">
            <!-- 이름 -->
            <FormField
              label="이름"
              name="service_name"
              placeholder="서비스 이름을 입력하세요."
              v-model="items.service_name"
              :error="errorMsg.service_name"
            />
          </div>

          <div class="input-wrapper">
            <!-- 가격 -->
            <FormField
              label="가격"
              type="number"
              name="price"
              placeholder="가격을 입력하세요."
              v-model="items.price"
              :error="errorMsg.price"
            />
          </div>

          <div class="input-wrapper">
            <!-- 소요 시간 -->
            <FormField
              label="소요 시간 (분)"
              type="number"
              name="duration_min"
              placeholder="소요 시간을 입력하세요."
              v-model="items.duration_min"
              :error="errorMsg.duration_min"
            />
          </div>
        </fieldset>

        <!-- 버튼 -->
        <div class="btn-group">
          <!-- 제출 버튼 -->
          <SubmitButton
            :loading="isSubmitting"
          >
            제출
          </SubmitButton>
          
          <!-- 목록 버튼 -->
          <button
            type="button"
            class="btn-secondary"
            @click="goList"
          >
            목록
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ServiceApi } from '@/api/service';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우터 생성
const router = useRouter();

// 입력창 변수
const items = reactive({
    service_name: "",
    price: "",
    duration_min: ""
});

// 상태 관리 변수
const isSubmitting = ref(false);   // 제출중
const errorMsg = reactive({})      // 필드 오류 메시지
const errorServerMsg = ref('');    // 서버 오류 메시지
const successMsg = ref('');        // 성공 메시지

// 입력창 검증
const validate = () => {
  errorMsg.service_name = items.service_name ? "" : "서비스 이름 입력은 필수입니다.";
  errorMsg.price = items.price ? "" : "가격 입력은 필수입니다.";
  errorMsg.duration_min = items.duration_min ? "" : "소요 시간 입력은 필수입니다."
  
  return !errorMsg.service_name && !errorMsg.price && !errorMsg.duration_min;
}

// 제출 로직
const handleSubmit = async () => {
  // 오류 메시지 초기화
  errorMsg.service_name = "";
  errorMsg.price = "";
  errorMsg.duration_min = "";
  errorServerMsg.value = "";

  // 입력창 검증
  if (!validate()) return;
  
  try {
    // isSubmitting => true
    isSubmitting.value = true;

    // payload => application/json으로 넘기기 위한 복사 작업
    const payload = {
                      service_name: items.service_name,
                      price: items.price,
                      duration_min: items.duration_min
                    }

    // ServiceApi.create(payload)
    const res = await ServiceApi.create(payload);
    const status = res.status;
    
    // response.status가 201이 아닐 경우
    // 에러 던지기
    if (status !== 201) {
      throw new Error("등록 요청이 정상적으로 처리되지 않았습니다.");
    }

    // 성공 메시지 alert 출력
    successMsg.value = "등록이 완료되었습니다.";
    alert(successMsg.value);

    // 입력창 초기화
    items.service_name = "";
    items.price = "";
    items.duration_min = "";
    
    // 목록으로 이동
    router.push('/service');

    return res;
  } catch(e) {
    // 서버 오류 메시지 console에 출력
    errorServerMsg.value = e.response?.data?.error?.message || "서버 오류가 발생했습니다.";
    console.log(errorServerMsg.value);
    alert(errorServerMsg.value); // 사용자에게 에러 알림
  } finally {
    // isSubmitting => false
    isSubmitting.value = false;
  }
}

// 목록 이동 함수
const goList = () => {
  router.push('/service');
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
    margin-bottom: 25px;
}

:deep(label) {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

:deep(input) {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #fff;
    transition: border-color 0.3s;
}

:deep(input:focus) {
    outline: none;
    border-color: #a8a6a4;
}

.btn-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
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
    background: #fff !important;
    color: #555 !important;
    border: 1px solid #ccc !important;
}

.btn-secondary:hover {
    background: #f0f0f0 !important;
    border-color: #bbb !important;
    color: #333 !important;
}

:deep(button:disabled) {
    background-color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .page > h2 { font-size: 24px; }
    .form-container { padding: 20px; }
}
</style>