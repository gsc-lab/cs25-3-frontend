<template>
  <section>
    <h2>디자이너 수정</h2>
    <!-- form -->
    <form @submit.prevent="handleUpdate" class="form">
      <fieldset>

        <!-- 경력 -->
        <FormField
          label="경력:"
          name="experience"
          placeholder="경력을 입력하세요."
          v-model="experience"
        /><br>

        <!-- 특기 -->
        <FormField
          label="특기:"
          name="good_at"
          placeholder="특기를 입력하세요."
          v-model="good_at"
        /><br>

        <!-- 성격 -->
        <FormField
          label="성격:"
          name="personality"
          placeholder="성격을 입력하세요."
          v-model="personality"
        /><br>

        <!-- 메시지 -->
        <FormField
          label="메시지:"
          name="message"
          placeholder="메시지를 입력하세요."
          v-model="message"
        /><br>

        <hr>

        <!-- 이미지 업로드 -->
        <FormField
          label="이미지:"
          type="file"
          name="image"
          @change="handleImgChange"
        /><br>

        <!-- 미리보기 -->
        <p>미리보기</p>
        <img
          v-if="previewURL"
          :src="previewURL"
          alt="이미지 없음"
          style="width: 200px; height: 300px; object-fit: cover;"
        />
      </fieldset>

      <!-- 수정 버튼 -->
      <SubmitButton :loading="isSubmitting">
        수정하기
      </SubmitButton>

      <!-- 목록 이동 -->
      <button type="button" @click="goList">
        목록
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DesignerApi } from '@/api/designer';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 라우터
const route = useRoute();
const router = useRouter();
const designerId = route.params.designer_id;

// 입력창 변수
const experience = ref('');
const good_at = ref('');
const personality = ref('');
const message = ref('');

// 이미지 변수
const imageUrl = ref(null);     // 기존 이미지 URL
const imageFile = ref(null);    // 새로 선택한 파일
const previewURL = ref(null);

// 상태 관리 변수
const isLoading = ref(false);
const isSubmitting = ref(false);
const errorServerMsg = ref('');

// 초기 정보 불러오기
const fetchInfo = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // DesignerApi.detail(designerId)
    const res = await DesignerApi.detail(designerId);
    const body = res.data;

    // response.data.success가 false일 경우
    // 에러 메시지 던지기
    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // 각 변수에 데이터 저장
    const designer = body.data.designer;

    // text 데이터
    experience.value = designer.experience;
    good_at.value = designer.good_at;
    personality.value = designer.personality;
    message.value = designer.message;

    // 이미지 데이터
    imageUrl.value = designer.image;
    previewURL.value = imageUrl.value;
    imageFile.value = null;

  } catch (e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
};

onMounted(fetchInfo);

// 이미지 변경
const handleImgChange = (e) => {
  imageFile.value = e.target.files[0] || null;
  previewURL.value = imageFile.value
                     ? URL.createObjectURL(imageFile.value)
                     : imageUrl.value;
};

// 수정 요청
const handleUpdate = async () => {
  errorServerMsg.value = '';
  isSubmitting.value = true;

  try {
    // 1) 텍스트 수정
    const payload = {
      experience: experience.value,
      good_at: good_at.value,
      personality: personality.value,
      message: message.value,
    };

    const res = await DesignerApi.update(designerId, payload);
    const body = res.data;

    if (!body?.success) {
      throw new Error(body?.error?.message);
    }

    // 2) 이미지 수정 (이미지를 새로 선택한 경우에만)
    if (imageFile.value) {
      const formData = new FormData();
      formData.append('image', imageFile.value);

      const resImg = await DesignerApi.updateImage(designerId, formData);
      const bodyImg = resImg.data;

      if (!bodyImg?.success) {
        throw new Error(bodyImg?.error?.message);
      }
    }

    // 3) 완료 후 이동
    alert('디자이너 정보가 수정되었습니다.');
    router.push('/designer');

  } catch (e) {
    errorServerMsg.value =
      e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);

  } finally {
    isSubmitting.value = false;
  }
};


// 디자이너 목록 이동 함수 정의
const goList = () => {
  router.push('/designer');
};
</script>
