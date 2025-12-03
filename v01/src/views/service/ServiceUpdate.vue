<template>
  <section class="page">
    <h2>SERVICE</h2>

    <!-- 로딩 -->
    <p v-if="isLoading" class="loading-msg">불러오는 중...</p>

    <!-- form -->
    <div v-else class="form-container">
      <form @submit.prevent="handleUpdate">
        <fieldset class="field-group">
          <div class="input-wrapper">
            <!-- 이름 -->
            <FormField
              label="이름"
              name="service_name"
              placeholder="서비스 이름을 입력하세요."
              v-model="service_name"
              :error="errorMsg.service_name"
            />
          </div>

          <div class="input-wrapper">
            <!-- 가격 -->
            <FormField
              label="가격"
              name="price"
              placeholder="가격을 입력하세요."
              v-model="price"
              :error="errorMsg.price"
            />
          </div>

          <div class="input-wrapper">
            <!-- 소요 시간 -->
            <FormField
              label="소요 시간 (분)"
              name="duration_min"
              placeholder="소요 시간을 입력하세요."
              v-model="duration_min"
              :error="errorMsg.duration_min"
            />
          </div>
        </fieldset>

        <!-- 버튼 -->
        <div class="btn-group">
          <!-- 수정 버튼 -->
          <SubmitButton
            :loading="isSubmitting"
          >
            수정
          </SubmitButton>

          <!-- 목록 이동 버튼 -->
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
import { ref, reactive, onMounted  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ServiceApi } from '@/api/service';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우트, 라우터 활성화
const route = useRoute();
const router = useRouter();
const serviceId = route.params.service_id;

// 입력창 변수
const service_name = ref('');
const price = ref('');
const duration_min = ref('');

// 상태 관리 변수
const isSubmitting = ref(false);   // 제출 중
const isLoading = ref(false);      // 로딩 중
const errorMsg = reactive({});     // 필드별 오류 메시지
const errorServerMsg = ref('');    // 서버별 오류 메시지
const successMsg = ref('');        // 성공 메시지

// 세부 정보 렌더링
const fetchList = async () => {
  // 오류 메시지 초기화
  errorMsg.service_name = "";
  errorMsg.price = "";
  errorMsg.duration_min = "";
  errorServerMsg.value = "";

  // isLoading => true
  isLoading.value = true;

  try {
    // 세부 정보 불러오기
    const res = await ServiceApi.show(serviceId);
    const body = res.data;
    const status = res.status;

    // http_response_code가 200이 아닐 경우
    // 에러 던지기
    if (status !== 200) {
        throw new Error("해당 게시물 정보를 가지고 올 수 없습니다.");
    }

    // 불러오기 성공했을 경우
    const service = body?.data;
    service_name.value = service.service_name;
    price.value = service.price;
    duration_min.value = service.duration_min;
  } catch(e) {
    // 서버 에러 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading => false
    isLoading.value = false;
  }
}

onMounted(fetchList);

// 입력창 검증
const validate = () => {
    errorMsg.service_name = service_name.value ? "" : "서비스 이름 입력은 필수입니다.";
    errorMsg.price = price.value ? "" : "가격 입력은 필수입니다.";
    errorMsg.duration_min = duration_min.value ? "" : "소요 시간 입력은 필수입니다.";

    return !errorMsg.service_name && !errorMsg.price && !errorMsg.duration_min;
}

// handleUpdate 함수 생성
const handleUpdate = async () => {
    // 에러 메시지 초기화
    errorMsg.service_name = "";
    errorMsg.price = "";
    errorMsg.duration_min = "";
    errorServerMsg.value = "";

    try {
      // isSubmitting => true
      isSubmitting.value = true;

      // 입력창 검증
      if (!validate()) return;

      // payload
      const payload = {
                        service_name: service_name.value,
                        price: price.value,
                        duration_min: duration_min.value
                      };

      // 업데이트 로직 실행
      const res = await ServiceApi.update(serviceId, payload);
      const status = res.status;

      // response.status가 201이 아닐 경우
      // 에러 메시지 던지기
      if (status !== 201) {
        throw new Error(res.data?.error?.message);
      }

      // 성공 메시지 저장
      successMsg.value = "수정을 완료했습니다.";
      alert(successMsg.value);
      
      // 목록으로 이동 (선택사항)
      router.push('/service');

    } catch(e) {
      // 서버 에러 발생
      errorServerMsg.value = e.response?.data?.error?.message || "오류가 발생했습니다.";
      console.log(e.response);
      alert(errorServerMsg.value)
    } finally {
      // isSubmitting => false
      isSubmitting.value = false;
    }
}

// 목록 이동 함수
const goList = () => {
  router.push('/service');
}

</script>

<style scoped>
.page {
  max-width: 600px;
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

.loading-msg {
    text-align: center;
    color: #666;
    margin: 20px 0;
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