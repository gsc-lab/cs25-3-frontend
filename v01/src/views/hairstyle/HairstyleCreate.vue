<template>
  <section class="form-section">
    <h2>새 헤어스타일 등록</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- 제목 -->
      <div class="field">
        <FormField
          label="제목"
          name="title"
          placeholder="예: 여성 커트"
          v-model="title"
          :error="fieldErrorTitle"
          autocomplete="off"
        />
      </div>

      <!-- 설명 -->
      <div class="field">
        <label>설명</label>
        <textarea
          v-model="description"
          rows="3"
          placeholder="예: 얼굴형 보정에 좋음"
        ></textarea>
      </div>

      <!-- 이미지 파일 첨부 -->
      <div class="field">
        <label>이미지 파일</label>
        <input type="file" accept="image/*" @change="handleFileChange" />
      </div>

      <!-- 백엔드에서 받은 에러 메시지 -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <!-- 성공 메시지 -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>

      <SubmitButton :loading="isSubmitting">
        등록하기
      </SubmitButton>
    </form>

    <router-link to="/hairstyle">목록</router-link>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { HairstyleApi } from "@/api/hairstyle";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

const emit = defineEmits(["created"]);

// 입력값 및 상태
const title = ref("");            // 제목
const description = ref("");      // 설명
const imageFile = ref(null);      // 이미지 파일

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

  // formData
  formData.append("title", trimmedTitle);
  formData.append("description", trimmedDesc);
  formData.append("image", imageFile.value);

  try {
    // 제출 로직 시작
    isSubmitting.value = true;

    // CREATE
    const res = await HairstyleApi.create(formData);
    const body = res;

    // response.data.success가 false일 경우
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    const newItem = body.data?.hairstyle ?? null;
    emit("created", newItem);

    // 폼 리셋
    title.value = "";
    description.value = "";
    imageFile.value = null;

    successMessage.value = "헤어스타일이 등록되었습니다.";
  } catch (e) {
    // 백엔드 메시지만 사용
    const msg = e.response?.data?.error?.message ?? "";
    errorMessage.value = msg;
  } finally {
    // 제출 로직 끝
    isSubmitting.value = false;
  }
};
</script>