<template>
  <section class="page">
    <h2>DESIGNER</h2>

    <!-- 로딩 -->
    <div class="form-container">
      <p v-if="isLoading" class="msg">불러오는 중...</p>

      <!-- form -->
      <form v-else @submit.prevent="handleUpdate">
        <fieldset class="field-group">
          <!-- 경력 -->
          <div class="input-wrapper">
            <FormField
              label="경력"
              name="experience"
              placeholder="경력을 입력하세요."
              v-model="experience"
            />
          </div>

          <!-- 특기 -->
          <div class="input-wrapper">
            <FormField
              label="특기"
              name="good_at"
              placeholder="특기를 입력하세요."
              v-model="good_at"
            />
          </div>

          <!-- 성격 -->
          <div class="input-wrapper">
            <FormField
              label="성격"
              name="personality"
              placeholder="성격을 입력하세요."
              v-model="personality"
            />
          </div>

          <!-- 메시지 -->
          <div class="input-wrapper">
            <FormField
              label="메시지"
              name="message"
              placeholder="메시지를 입력하세요."
              v-model="message"
            />
          </div>

          <!-- 이미지 업로드 + 미리보기 -->
          <div class="input-wrapper">
            <label class="form-label">이미지</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              @change="handleImgChange"
              class="form-input-file"
            />

            <div class="preview-container">
              <p class="preview-label">현재 이미지</p>

              <div v-if="previewURL" class="preview-box">
                <img :src="previewURL" alt="이미지 미리보기" />
              </div>
              <div v-else class="no-image">
                이미지가 없습니다.
              </div>
            </div>
          </div>
        </fieldset>

        <!-- 버튼 -->
        <div class="btn-group">
          <!-- 수정 버튼 -->
          <SubmitButton :loading="isSubmitting">
            수정하기
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DesignerApi } from '@/api/designer';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우트 및 라우터 생성
const route = useRoute();
const router = useRouter();
const designerId = route.params.designer_id;

// 목록 및 입력창 변수
const experience = ref('');
const good_at = ref('');
const personality = ref('');
const message = ref('');
const imageUrl = ref(null);
const imageFile = ref(null);
const previewURL = ref(null);

// 상태 관리 변수
const isLoading = ref(false);
const isSubmitting = ref(false);
const errorServerMsg = ref('');

// 특정 디자이너 정보 불러오기
const fetchInfo = async () => {
  // 서버 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // DesignerApi.detail(designerId)
    const res = await DesignerApi.detail(designerId);
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // 입력창 변수에 불러온 정보 저장
    const designer = body.data.designer;

    experience.value = designer.experience;
    good_at.value = designer.good_at;
    personality.value = designer.personality;
    message.value = designer.message;
    imageUrl.value = designer.image;
    previewURL.value = imageUrl.value;
    imageFile.value = null;
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value =
      e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

onMounted(fetchInfo)

// 이미지 등록
const handleImgChange = (e) => {
  imageFile.value = e.target.files[0] || null;
  previewURL.value = imageFile.value
    ? URL.createObjectURL(imageFile.value)
    : imageUrl.value;
}

// 디자이너 수정
const handleUpdate = async () => {
  // 서버 오류 메시지 초기화
  errorServerMsg.value = '';

  // isSubmitting 활성화
  isSubmitting.value = true;

  try {
    // payload
    const payload = {
      experience: experience.value,
      good_at: good_at.value,
      personality: personality.value,
      message: message.value,
    }

    // DesignerApi.update(designerId, payload)
    const res = await DesignerApi.update(designerId, payload);
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // 이미지 업로드
    if (imageFile.value) {
      const formData = new FormData();
      formData.append('image', imageFile.value);

      // DesignerApi.updateImage(designerId, formData)
      const resImg = await DesignerApi.updateImage(designerId, formData);
      const bodyImg = resImg.data;

      // response.data.success가 false인 경우
      // 에러 메시지 던지기
      if (!bodyImg?.success) {
        throw new Error(bodyImg?.error?.message);
      }
    }

    // 수정 성공 메시지 출력 후 목록 이동
    alert('디자이너 정보가 수정되었습니다.');
    router.push('/designer');
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 활성화
    isSubmitting.value = false;
  }
}

// 디자이너 목록 이동 함수 정의
const goList = () => {
  router.push('/designer');
}
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

.msg {
  text-align: center;
  color: #666;
  margin: 20px 0;
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
  margin-bottom: 25px;
}

.form-label,
:deep(label) {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-input-file,
:deep(input[type="text"]) {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.form-input-file {
  padding: 10px;
}

:deep(input:focus) {
  outline: none;
  border-color: #a8a6a4;
}

.preview-container {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0 0 10px 0;
}

.preview-box {
  text-align: center;
}

.preview-box img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.no-image {
  text-align: center;
  color: #999;
  padding: 20px 0;
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
</style>
