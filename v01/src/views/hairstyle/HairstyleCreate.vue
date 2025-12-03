<template>
  <section class="page">
    <h2>HAIRSTYLE</h2>

    <!-- form -->
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <fieldset class="field-group">
          <!-- 제목 -->
          <div class="input-wrapper">
            <FormField
              label="제목"
              name="title"
              placeholder="예: 여성 커트"
              v-model="title"
              autocomplete="off"
            />
          </div>

          <!-- 설명 -->
          <div class="input-wrapper">
            <label>설명</label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="예: 얼굴형 보정에 좋음"
            ></textarea>
          </div>

          <!-- 이미지 파일 첨부 -->
          <div class="input-wrapper">
            <label>이미지 파일</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
            />
          </div>
        </fieldset>

        <!-- 서버 오류 메시지 -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <!-- 등록 버튼 -->
        <div class="btn-group">
          <SubmitButton :loading="isSubmitting">
            등록하기
          </SubmitButton>

          <!--  -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { HairstyleApi } from "@/api/hairstyle";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

const emit = defineEmits(["created"]);

// 라우터 객체 생성
const router = useRouter();

// 입력창 변수
const title = ref("");            // 제목
const description = ref("");      // 설명
const imageFile = ref(null);      // 이미지 파일

// 상태 관리 변수
const isSubmitting = ref(false);  // 제출중
const errorMessage = ref("");     // 에러 메시지
const successMessage = ref("");   // 성공 메시지

// 이미지 파일 선택
const handleFileChange = (e) => {
  imageFile.value = e.target.files?.[0] ?? null;
};

// 제출 처리
const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // 앞뒤 공백 제거
  const trimmedTitle = title.value.trim();
  const trimmedDesc = description.value.trim();

  // 제출 시 각 항목이 비어있다면 에러 메시지 출력
  if (!trimmedTitle) {
    errorMessage.value = "제목을 입력해주세요.";
    return;
  }

  if (!trimmedDesc) {
    errorMessage.value = "설명을 입력해주세요.";
    return;
  }

  if (!imageFile.value) {
    errorMessage.value = "이미지 파일을 선택해주세요.";
    return;
  }

  // FormData 생성
  // 텍스트 데이터, 파일 데이터를 함께 담아서 서버로 전송
  const formData = new FormData();

  formData.append("title", trimmedTitle);
  formData.append("description", trimmedDesc);
  formData.append("image", imageFile.value);

  try {
    // isSubmitting 활성화
    isSubmitting.value = true;

    // HairstyleApi.create(formData)
    const res = await HairstyleApi.create(formData);
    const body = res;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // newItem 변수에 불러온 헤어스타일 정보 저장
    const newItem = body.data?.hairstyle ?? null;
    emit("created", newItem);

    // 폼 리셋
    title.value = "";
    description.value = "";
    imageFile.value = null;

    // 등록이 완료되었을 경우
    // 성공 메시지 출력 후 헤어스타일 목록으로 이동
    successMessage.value = "헤어스타일이 등록되었습니다.";
    alert(successMessage.value);
    router.push("/hairstyle");
  } catch (e) {
    // 서버 오류 메시지 출력
    const msg = e.response?.data?.error?.message ?? "";
    errorMessage.value = msg;
    alert(msg);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
};

// 헤어스타일 목록 페이지 이동 함수
const goList = () => {
  router.push("/hairstyle");
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

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  resize: vertical;
  background-color: #fff;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #a8a6a4;
}

input[type="file"] {
  font-size: 13px;
}

.error {
  margin-top: 5px;
  font-size: 13px;
  color: #d9534f;
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
  .page > h2 {
    font-size: 24px;
  }
  .form-container {
    padding: 20px;
  }
}
</style>
