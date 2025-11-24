<template>
  <section class="form-section">
    <h2>공지사항 작성</h2>

    <!-- form 입력창 -->
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="field">
        <!-- 제목 -->
        <FormField
          label="제목: "
          name="title"
          placeholder="제목을 입력하세요."
          v-model="items.title"
        />
        <br>

        <!-- 내용 -->
        <label class="form-label">내용: </label>
        <textarea
          class="form-input"
          name="content"
          placeholder="내용을 입력하세요."
          v-model="items.content"
        ></textarea>
        <br>

        <!-- 이미지 -->
        <FormField
          label="이미지: "
          type="file"
          name="file"
          v-model="items.file"
          :accept="'image/*'"
        />
        <br>
      </div>

      <!-- 서버 에러 / 성공 메시지 -->
      <p v-if="errorMsg" class="form-error">
        {{ errorMsg }}
      </p>
      <p v-else-if="errorServerMsg" class="form-error">
        {{ errorServerMsg }}
      </p>
      <p v-else-if="successMessage" class="form-success">
        {{ successMessage }}
      </p>

      <SubmitButton
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        등록하기
      </SubmitButton>

      <button type="button" @click="goList">
        목록
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { NewsApi } from '@/api/news';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우터 선언
const router = useRouter();

// 상태 관리 변수 선언
const isSubmitting = ref(false);    // 제출 상태
const errorMsg = ref('');           // 필드 에러 메시지
const errorServerMsg = ref('');     // 서버 에러 메시지
const successMessage = ref('');     // 성공 메시지

// 입력 데이터
const items = reactive({
  title: '',
  content: '',
  file: null,
});

// 제출 이벤트
const handleSubmit = async () => {
  // 서버 메시지 초기화
  errorServerMsg.value = '';
  successMessage.value = '';

  try {
    // 제출 시작
    isSubmitting.value = true;

    // formData 객체 생성
    const formData = new FormData();

    // formData 객체에 저장
    formData.append('title', items.title);
    formData.append('content', items.content);
    // 만약 items.file이 있다면 formData 객체에 저장
    if (items.file) {
      formData.append('file', items.file);
    }

    // 백엔드로 보내기
    const res = await NewsApi.create(formData);
    
    // response.status가 201이 아닌 경우 오류 메시지 저장
    if (res.status !== 201) {
      throw new Error()
    } else {   // 201인 경우 성공 메시지 저장
      successMessage.value = '데이터를 저장했습니다.';

      // items 초기화
      items.title = "";
      items.content = "";
      items.file = "";
    }
  } catch (e) {   // 서버 오류가 발생했을 경우
    errorServerMsg.value = e.response?.data?.error?.message ?? '';
  } finally {
    // isSubmitting -> false 처리
    isSubmitting.value = false;
  }
};

// 목록 돌아가기
const goList = () => {
  router.push('/news');
};
</script>
