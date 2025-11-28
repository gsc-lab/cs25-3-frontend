<template>
  <section>
    <h2>서비스 수정</h2>
    <!-- 불러오기 -->
    <p v-if="isLoading">불러오는 중...</p>

    <!-- form 생성 -->
    <form v-else @submit.prevent="handleUpdate">
      <div class="form">
        <!-- 입력창 -->
        <!-- 서비스 이름 -->
        <FormField
          label="이름: "
          name="service_name"
          placeholder="서비스 이름을 입력하세요."
          v-model="service_name"
        /> <br>
        <!-- 가격 -->
        <FormField
          label="가격: "
          name="price"
          placeholder="가격을 입력하세요."
          v-model="price"
        /> <br>
        <!-- 소요 시간 -->
        <FormField
          label="소요 시간: "
          name="duration_min"
          placeholder="소요 시간을 입력하세요."
          v-model="duration_min"
        /> <br>

        <!-- 제출 버튼 -->
        <SubmitButton
          :loading="isSubmitting"
        >
          제출
        </SubmitButton>

        <!-- 목록 이동 버튼 -->
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
import { ref, reactive, onMounted  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ServiceApi } from '@/api/service';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우트, 라우터 활성화
const route = useRoute();
const router = useRouter();
const serviceId = route.params.service_id;

// 입력창
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
    // 서버 에러 메시지 console 출력
    errorServerMsg.value = e.response?.data?.error?.message;
    console.log(e);
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

    } catch(e) {
      // 서버 에러 발생
      errorServerMsg.value = e.response?.data?.error?.message;
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