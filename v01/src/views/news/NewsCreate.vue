<template>
  <section class="page">
    <h2>NEWS</h2>

    <!-- form -->
    <div class="form-container">
      <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <fieldset class="field-group">
          <div class="input-wrapper">
            <!-- 제목 -->
            <FormField
              label="제목"
              name="title"
              placeholder="제목을 입력하세요."
              v-model="items.title"
            />
          </div>

          <div class="input-wrapper">
            <!-- 내용 -->
            <label class="form-label">내용</label>
            <textarea
              class="form-input"
              name="content"
              placeholder="내용을 입력하세요."
              v-model="items.content"
            ></textarea>
          </div>

          <div class="input-wrapper">
            <!-- 이미지 -->
            <FormField
              label="이미지"
              type="file"
              name="file"
              v-model="items.file"
              :accept="'image/*'"
            />
          </div>
        </fieldset>

        <!-- 오류 및 성공 메시지 -->
        <div class="message-area">
            <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
            <p v-else-if="errorServerMsg" class="form-error">{{ errorServerMsg }}</p>
            <p v-else-if="successMessage" class="form-success">{{ successMessage }}</p>
        </div>

        <!-- 버튼 -->
        <div class="btn-group">
          <!-- 등록 버튼 -->
          <SubmitButton
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            등록하기
          </SubmitButton>

          <!-- 목록 이동 버튼 -->
          <button type="button" class="btn-secondary" @click="goList">
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
      formData.append('image', items.file);
    }

    // 백엔드로 보내기
    const res = await NewsApi.create(formData);
    
    // response.status가 201이 아닌 경우 오류 메시지 저장
    if (res.status !== 201) {
      throw new Error()
    } else {   // 201인 경우 성공 메시지 저장
      successMessage.value = '데이터를 저장했습니다.';
      alert("공지사항이 등록되었습니다."); // 알림 추가

      // items 초기화
      items.title = "";
      items.content = "";
      items.file = "";
      
      // 목록으로 이동 (선택사항)
      router.push('/news');
    }
  } catch (e) {   // 서버 오류가 발생했을 경우
    errorServerMsg.value = e.response?.data?.error?.message ?? '등록 중 오류가 발생했습니다.';
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

.form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background-color: #fafafa;
}

.field-group {
    border: none;
    padding: 0;
    margin: 0;
}

.input-wrapper {
    margin-bottom: 20px;
}

.form-label,
:deep(label) {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.form-input,
:deep(input[type="text"]),
:deep(input[type="password"]),
:deep(input[type="file"]) {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #fff;
    transition: border-color 0.3s;
}

.form-input {
    resize: vertical;
    min-height: 200px;
    font-family: inherit;
}

.form-input:focus,
:deep(input:focus) {
    outline: none;
    border-color: #a8a6a4;
}

.message-area {
    min-height: 24px;
    margin: 10px 0 20px;
    text-align: center;
}
.form-error { color: #d9534f; font-weight: 500; }
.form-success { color: #5cb85c; font-weight: 500; }

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
</style>