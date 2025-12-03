<template>
  <section class="page">
    <h2>DESIGNER</h2>

    <!-- 서버 오류 메시지 -->
    <div class="form-container">
      <p v-if="errorServerMsg" class="msg error">
        {{ errorServerMsg }}
      </p>

      <!-- form -->
      <form @submit.prevent="handleCreate">
        <fieldset class="field-group">
          <!-- 경력 -->
          <div class="input-wrapper">
            <FormField
              label="경력"
              name="experience"
              type="number"
              v-model="experience"
              placeholder="경력을 입력하세요."
            />
          </div>

          <!-- 특기 -->
          <div class="input-wrapper">
            <FormField
              label="특기"
              name="good_at"
              v-model="good_at"
              placeholder="특기를 입력하세요."
            />
          </div>

          <!-- 성격 -->
          <div class="input-wrapper">
            <FormField
              label="성격"
              name="personality"
              v-model="personality"
              placeholder="성격을 입력하세요."
            />
          </div>

          <!-- 메시지 -->
          <div class="input-wrapper">
            <FormField
              label="메시지"
              name="message"
              v-model="message"
              placeholder="메시지를 입력하세요."
            />
          </div>

          <!-- 이미지 업로드 + 미리보기 -->
          <div class="input-wrapper">
            <label class="form-label">이미지</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              class="form-input-file"
              @change="handleImgChange"
            />

            <div class="preview-container">
              <p class="preview-label">미리보기</p>

              <div v-if="previewURL" class="preview-box">
                <img :src="previewURL" alt="이미지 미리보기" />
              </div>
              <div v-else class="no-image">
                이미지가 없습니다.
              </div>
            </div>
          </div>
        </fieldset>

        <!-- 등록 버튼 -->
        <div class="btn-group">
          <SubmitButton :loading="isSubmitting">
            등록하기
          </SubmitButton>

          <!-- 목록 버튼 -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DesignerApi } from '@/api/designer'
import { useUserStore } from '@/stores/user'
import FormField from '@/components/FormField.vue'
import SubmitButton from '@/components/SubmitButton.vue'

// 로그인 정보 가져오기
const userStore = useUserStore()
const user_id = userStore.user.user_id

// 라우터 생성
const router = useRouter()

// 입력창 변수
const experience = ref('')
const good_at = ref('')
const personality = ref('')
const message = ref('')
const image = ref(null)
const previewURL = ref('')

// 상태 관리 변수
const isSubmitting = ref(false)
const errorServerMsg = ref('')

// 이미지 올리기
const handleImgChange = (e) => {
  const file = e.target.files[0] || null
  image.value = file
  previewURL.value = file ? URL.createObjectURL(file) : ''
}

// 디자이너 생성
const handleCreate = async () => {
  // 서버 오류 메시지 초기화
  errorServerMsg.value = ''

  // isSubmitting 활성화
  isSubmitting.value = true

  try {
    // formData 생성
    const formData = new FormData()

    formData.append('user_id', user_id)
    formData.append('experience', experience.value)
    formData.append('good_at', good_at.value)
    formData.append('personality', personality.value)
    formData.append('message', message.value)

    // 이미지 파일이 있다면
    // 이미지 파일도 formData로 저장
    if (image.value) {
      formData.append('image', image.value)
    }

    // DesignerApi.create(formData)
    const res = await DesignerApi.create(formData)
    const body = res.data

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message)
    }

    // 성공 메시지 출력 후 목록으로 이동
    alert('디자이너 정보가 등록되었습니다.')
    router.push('/designer')
  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value =
      e.response?.data?.error?.message || e.message
    alert(errorServerMsg.value)
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false
  }
}

// 디자이너 목록 페이지 이동 함수
const goList = () => {
  router.push('/designer')
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
  margin: 0 0 20px;
}

.msg.error {
  color: #d9534f;
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
:deep(input[type="text"]),
:deep(input[type="number"]) {
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
