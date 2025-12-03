<template>
  <section class="page">
    <h2>NEWS</h2>

    <div class="form-container">
      <!-- 로딩 -->
      <p v-if="isLoading" class="msg">불러오는 중...</p>

      <!-- form -->
      <form v-else @submit.prevent="handleUpdate">
        <fieldset class="field-group">
          <div class="input-wrapper">
            <!-- 제목 -->
            <FormField
              label="제목"
              placeholder="제목을 입력하세요."
              name="title"
              v-model="title"
            />
          </div>

          <div class="input-wrapper">
            <!-- 내용 -->
            <FormField
              label="내용"
              placeholder="내용을 입력하세요."
              name="content"
              v-model="content"
              as="textarea" 
            /> 
            </div>

          <div class="input-wrapper">
            <!-- 이미지 -->
            <label class="form-label">이미지</label>
            <input
              type="file"
              name="file"
              @change="handleFileChange"
              accept="image/*"
              class="form-input-file"
            />
            
            <div class="preview-container">
                <p class="preview-label">현재 이미지</p>
                <div v-if="previewUrl" class="preview-box">
                    <img :src="previewUrl" alt="이미지 미리보기" />
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NewsApi } from '@/api/news'
import FormField from '@/components/FormField.vue'
import SubmitButton from '@/components/SubmitButton.vue'

// 라우트, 라우터 생성
const route = useRoute()
const router = useRouter()
const newsId = route.params.news_id

// 입력값
const title = ref('')
const content = ref('')

// 원래 서버에 저장된 이미지 URL
const fileUrl = ref('')

// 새로 선택한 파일
const newFile = ref(null)

// 화면에 보여줄 프리뷰 URL
const previewUrl = ref('')

// 상태 관리 변수
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')
const errorServerMsg = ref('')

// 정보 가져오기
const fetchData = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = ''

  // isLoading 활성화
  isLoading.value = true

  // 정보 가져오기
  try {
    const res = await NewsApi.detail(newsId)
    const body = res.data

    // response.data.success가 false인 경우
    // 에러 던지기
    if (!body.success) {
      throw new Error(body.error?.message || '공지사항을 불러오지 못했습니다.')
    }

    // 정보 가져와서 변수에 저장
    title.value = body.data?.news.title ?? ''
    content.value = body.data?.news.content ?? ''
    fileUrl.value = body.data?.news.file ?? ''

    // 가져온 파일 URL을 미리보기 변수에 저장
    previewUrl.value = fileUrl.value
  } catch (e) {
    // 서버 오류 메시지 출력
    console.error(e)
    errorServerMsg.value = e.message ?? '서버 오류가 발생했습니다.'
    alert(errorServerMsg.value)
  } finally {
    // isLoading 비활성화
    isLoading.value = false
  }
}

onMounted(fetchData)

// 파일 변경 핸들러 생성
const handleFileChange = (e) => {
  const file = e.target.files[0];
  newFile.value = file

  // 새 파일이 있을 경우
  if (file) {
    // 새 파일 선택 -> 프리뷰도 새 파일로 교체
    previewUrl.value = URL.createObjectURL(file)
  } else {  // 새 파일이 없을 경우
    // 파일 선택 취소 -> 기존 이미지로 복원
    previewUrl.value = fileUrl.value
  }
}

// 수정 핸들러 생성
const handleUpdate = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = ''
  errorMsg.value = ''

  // isSubmitting 활성화
  isSubmitting.value = true

  try {
    // payload
    const payload = {
      title: title.value,
      content: content.value
    }

    // update 로직
    const res = await NewsApi.update(newsId, payload)
    const body = res.data

    // response.data.success가 false인 경우
    // 에러 던지기
    if (!body?.success) {
      throw new Error(body.error?.message || '공지사항 텍스트 수정에 실패했습니다.')
    }

    // 파일을 업로드 했을 경우 updateFile 호출
    if (newFile.value) {
      const formData = new FormData()
      formData.append('image', newFile.value)

      // 파일 업로드
      const resFile = await NewsApi.updateImage(newsId, formData);
      const bodyFile = resFile.data

      // response.data.success가 false인 경우
      // 에러 던지기
      if (!bodyFile?.success) {
        throw new Error(bodyFile.error?.message || '이미지 수정에 실패했습니다.')
      }
    }

    // 수정 성공 메시지 출력 후 공지사항 목록 이동
    alert('수정에 성공했습니다.')
    router.push('/news')
  } catch (e) {
    // 서버 오류 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value)
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false
  }
}

// 공지사항 목록 이동 함수
const goList = () => {
  router.push('/news')
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

.page h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
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

.form-input,
.form-input-file,
:deep(input[type="text"]),
:deep(textarea) {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #fff;
    transition: border-color 0.3s;
}

:deep(textarea) {
     min-height: 200px;
     font-family: inherit;
     resize: vertical;
}

.form-input:focus,
:deep(input:focus),
:deep(textarea:focus) {
    outline: none;
    border-color: #a8a6a4;
}

.form-input-file {
    padding: 10px;
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
    max-height: 400px;
    border-radius: 4px;
    border: 1px solid #ddd;
    object-fit: contain;
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