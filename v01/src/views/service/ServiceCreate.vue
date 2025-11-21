<template>
  <section>
    <h2>서비스 등록</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form">
        <!-- 서비스 이름 -->
        <FormField
          label="이름: "
          name="service_name"
          placeholder="서비스 이름을 입력하세요."
          v-model="items.service_name"
          :error="errorMsg.service_name"
        /> <br>

        <!-- 가격 -->
        <FormField
          label="가격: "
          type="number"
          name="price"
          placeholder="가격을 입력하세요."
          v-model="items.price"
          :error="errorMsg.price"
        /> <br>

        <!-- 소요 시간 -->
        <FormField
          label="소요 시간: "
          type="number"
          name="service_name"
          placeholder="소요 시간을 입력하세요."
          v-model="items.duration_min"
          :error="errorMsg.duration_min"
        /> <br>

        <!-- 등록하기 -->
        <SubmitButton
          :loading="isSubmitting"
        >
          제출
        </SubmitButton>
        <button
          type="button"
          @click="goList"
        >
          목록
        </button>
      </div>
    </form>
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

// 상태 관리 변수
const items = reactive({});        // 입력창
const isSubmitting = ref(false);   // 제출중
const errorMsg = reactive({})      // 필드 오류 메시지
const errorServerMsg = ref('');    // 서버 오류 메시지
const successMsg = ref('');        // 성공 메시지

// 입력창 초기화
items.service_name = "";
items.price = "";
items.duration_min = "";

// 앞뒤 공백 제거
// const service_name = items.service_name.trim();
// const price = items.price.trim();
// const duration_min = items.duration_min.trim();

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

    // CREATE
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

    return res;
  } catch(e) {
    // 서버 오류 메시지 console에 출력
    errorServerMsg.value = e.response?.data?.error?.message;
    console.log(errorServerMsg.value);
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