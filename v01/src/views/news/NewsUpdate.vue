<template>
  <section>
    <h2>공지사항 수정</h2>

    <p v-if="isLoading">불러오는 중...</p>

    <!-- form -->
    <form v-else @submit.prevent="handleUpdate">

      <!-- 제목 -->
      <FormField
        label="제목: "
        placeholder="제목을 입력하세요."
        name="title"
        v-model="title"
      /> <br>

      <!-- 내용 -->
      <FormField
        label="내용: "
        placeholder="내용을 입력하세요."
        name="content"
        v-model="content"
      /> <br>

      <!-- 이미지 -->
      <FormField
        type="file"
        label="이미지: "
        name="file"
        @change="handleFileChange"
      /> <br>

      <!-- 이미지 미리보기 -->
      <p>현재 이미지</p>
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="이미지 없음"
        style="max-width: 400px; display: block;"
      />
      <p v-else>이미지가 없습니다.</p>

      <!-- 수정하기 버튼 -->
      <SubmitButton :loading="isSubmitting">
        수정하기
      </SubmitButton>

      <!-- 공지사항 목록 이동 -->
      <button
        type="button"
        @click="goList"
      >
        목록
      </button>
    </form>
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
      formData.append('file', newFile.value)

      // 파일 업로드
      const resFile = await NewsApi.updateFile(newsId, formData);
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
    errorServerMsg.value = e.message ?? '서버에 오류가 발생했습니다.'
    console.log(e);
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
