<template>
  <section class="page">
    <h2>HAIRSTYLE</h2>

    <div class="form-container">
      <!-- 로딩 상태 -->
      <div v-if="isLoading">불러오는 중...</div>

      <!-- form -->
      <form v-else @submit.prevent="handleSubmit">
        <fieldset class="field-group">
          <!-- 제목 -->
          <div class="input-wrapper">
            <FormField
              label="제목"
              name="title"
              placeholder="예: 단발 레이어 컷"
              v-model="title"
              autocomplete="off"
            />
          </div>

          <!-- 설명 -->
          <div class="input-wrapper">
            <label>설명</label>
            <textarea v-model="description" rows="3"></textarea>
          </div>

          <!-- 현재 이미지 -->
          <div class="input-wrapper">
            <label>미리보기</label>

            <div v-if="currentImage" class="preview">
              <img :src="currentImage" alt="current" />
            </div>

            <p v-else class="no-image">등록된 이미지가 없습니다.</p>
          </div>

          <!-- 이미지 변경 -->
          <div class="input-wrapper">
            <label>이미지</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageChange"
            />
          </div>
        </fieldset>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="msg msg-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="msg msg-success">{{ successMessage }}</p>

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
            @click="goBack"
          >
            목록
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HairstyleApi } from "@/api/hairstyle";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

// 라우터 객체
const route = useRoute();
const router = useRouter();
const hairId = route.params.hair_id;  // 현재 URL 정보 가져오기

// 입력창 및 목록 변수
const title = ref("");           // 제목
const description = ref("");     // 설명
const currentImage = ref("");    // 기존 이미지
const newImageFile = ref(null);  // 새 이미지

// 상태 관리 변수
const isLoading = ref(false);    // 로딩중
const isSubmitting = ref(false); // 제출중
const errorMessage = ref("");    // 에러 메시지
const successMessage = ref("");  // 성공 메시지

// 기존 데이터 불러오기
const fetchData = async () => {
  try {
    // isLoading 활성화
    isLoading.value = true;

    // 서버 오류 메시지 초기화
    errorMessage.value = "";

    // HairstyleApi.get(hairId)
    const res = await HairstyleApi.get(hairId);
    const body = res;

    // response.data.success가 false일 경우
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // item 변수에 hairstyle 정보 저장
    const item = body.data.hairstyle;

    title.value = item.title;          // 제목
    description.value = item.description;  // 설명
    currentImage.value = item.image;   // 이미지
  } catch (err) {
    // 서버 오류 메시지 출력
    errorMessage.value = err?.response?.data?.error?.message ?? "";
    alert(errorMessage.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchData);

// 새 이미지 선택
const handleImageChange = (e) => {
  newImageFile.value = e.target.files?.[0] ?? null;
};

// 수정 제출
const handleSubmit = async () => {
  errorMessage.value = "";   // 에러 메시지 초기화
  successMessage.value = ""; // 성공 메시지 초기화

  // 앞뒤 공백 제거
  const trimmedTitle = title.value.trim();
  const trimmedDesc = description.value.trim();

  // 제출 시 빈 값이 있는지 검증
  if (!trimmedTitle) {
    errorMessage.value = "제목을 입력해주세요.";
    return;
  }

  if (!trimmedDesc) {
    errorMessage.value = "설명을 입력해주세요.";
    return;
  }

  try {
    isSubmitting.value = true;   // 제출 시작

    // 텍스트 수정
    const payload = {
      title: trimmedTitle,
      description: trimmedDesc,
    };

    // HairstyleApi.update(hairId, payload)
    const resText = await HairstyleApi.update(hairId, payload);
    const bodyText = resText;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!bodyText?.success) {
      throw new Error(bodyText?.error?.message);
    }

    // 이미지 교체
    if (newImageFile.value) {
      const formData = new FormData();
      formData.append("image", newImageFile.value);

      // HairstyleApi.updateImage(hairId, formData)
      const resImg = await HairstyleApi.updateImage(hairId, formData);
      const bodyImg = resImg;

      // response.data.success가 false인 경우
      // 에러 메시지 던지기
      if (!bodyImg?.success) {
        throw new Error(bodyImg?.error?.message);
      }

      // 이미지 정보 저장
      const updated = bodyImg.data.hairstyle;
      currentImage.value = updated.image;
      newImageFile.value = null;
    }

    // 수정 성공 시
    // 성공 메시지 출력 후 목록 이동
    successMessage.value = "수정이 완료되었습니다.";
    alert(successMessage.value);
    router.push("/hairstyle");
  } catch (e) {
    // 서버 오류 메시지 출력
    errorMessage.value = e?.response?.data?.error?.message ?? "";
    alert(errorMessage.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
};

// 목록으로 이동
const goBack = () => {
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

:deep(label),
.input-wrapper > label {
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

.preview {
  margin-top: 8px;
}

.preview img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-image {
  font-size: 13px;
  color: #777;
}

.msg {
  margin-top: 5px;
  font-size: 13px;
}

.msg-error {
  color: #d9534f;
}

.msg-success {
  color: #3c763d;
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

.form-container > div[v-if="isLoading"] {
  margin: 10px 0;
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
