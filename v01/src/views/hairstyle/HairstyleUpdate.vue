<template>
  <section class="form-section">
    <h2>헤어스타일 수정</h2>

    <!-- 로딩 상태 -->
    <div v-if="isLoading">불러오는 중...</div>

    <!-- 수정 폼 -->
    <form v-else @submit.prevent="handleSubmit" class="form">

      <!-- 제목 -->
      <div class="field">
        <FormField
          label="제목"
          name="title"
          placeholder="예: 단발 레이어 컷"
          v-model="title"
          autocomplete="off"
        />
      </div>

      <!-- 설명 -->
      <div class="field">
        <label>설명</label>
        <textarea v-model="description" rows="3"></textarea>
      </div>

      <!-- 현재 이미지 -->
      <div class="field">
        <label>현재 이미지</label>

        <div v-if="currentImage" class="preview">
          <img :src="currentImage" alt="current" />
        </div>

        <p v-else class="no-image">등록된 이미지가 없습니다.</p>
      </div>

      <!-- 이미지 변경 -->
      <div class="field">
        <label>이미지 변경</label>
        <input type="file" accept="image/*" @change="handleImageChange" />
      </div>

      <!-- 에러 메시지 -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <!-- 성공 메시지 -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>

      <SubmitButton :loading="isSubmitting">
        수정하기
      </SubmitButton>

      <button type="button" class="secondary" @click="goBack">
        목록으로
      </button>
    </form>
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

// 상태 및 폼 데이터
const title = ref("");           // 제목
const description = ref("");     // 설명
const currentImage = ref("");    // 기존 이미지
const newImageFile = ref(null);  // 새 이미지

const isLoading = ref(false);    // 로딩중
const isSubmitting = ref(false); // 제출중
const errorMessage = ref("");    // 에러 메시지
const successMessage = ref("");  // 성공 메시지

// 기존 데이터 불러오기
const fetchData = async () => {
  try {
    isLoading.value = true;   // 로딩 시작
    errorMessage.value = "";  // 에러 메시지 초기화

    // GET
    const res = await HairstyleApi.get(hairId);
    const body = res;

    // response.data.success가 false일 경우
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // item 변수에 hairstyle 정보 저장
    const item = body.data.hairstyle;

    title.value = item.title;  // 제목
    description.value = item.description;  // 설명
    currentImage.value = item.image;  // 이미지
  } catch (err) {
    errorMessage.value = err?.response?.data?.error?.message ?? "";
  } finally {
    isLoading.value = false;  // 로딩 끝
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

    // UPDATE
    const resText = await HairstyleApi.update(hairId, payload);
    const bodyText = resText;

    // response.data.success가 false일 경우
    if (!bodyText?.success) {
      throw new Error(bodyText?.error?.message);
    }

    // 이미지 교체 (선택된 경우만)
    if (newImageFile.value) {
      const formData = new FormData();
      formData.append("image", newImageFile.value);

      // UPDATE (이미지)
      const resImg = await HairstyleApi.updateImage(hairId, formData);
      const bodyImg = resImg;

      // response.data.success가 false일 경우
      if (!bodyImg?.success) {
        throw new Error(bodyImg?.error?.message);
      }

      // response.data.data.hairstyle.image를 currentImage.value에 저장
      const updated = bodyImg.data.hairstyle;
      currentImage.value = updated.image;

      newImageFile.value = null;  // newImageFile는 null 처리
    }

    successMessage.value = "수정이 완료되었습니다.";
  } catch (err) {
    errorMessage.value = err?.response?.data?.error?.message ?? "";
  } finally {
    isSubmitting.value = false;  // 제출 종료
  }
};

// 목록으로 이동
const goBack = () => {
  router.push("/hairstyle");
};
</script>
