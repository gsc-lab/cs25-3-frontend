<template>
  <section>

    <h2>디자이너 등록</h2>
    <form @submit.prevent="handleCreate" class="form">
      <fieldset>
        <!-- 경력 -->
        <FormField
          label="경력: "
          name="experience"
          type="number"
          v-model="experience"
          placeholder="경력을 입력하세요."
        /> <br>

        <!-- 특기 -->
        <FormField
          label="특기: "
          name="good_at"
          v-model="good_at"
          placeholder="특기를 입력하세요."
        /> <br>

        <!-- 성격 -->
        <FormField
          label="성격: "
          name="personality"
          v-model="personality"
          placeholder="성격을 입력하세요."
        /> <br>

        <!-- 메시지 -->
        <FormField
          label="메시지: "
          name="message"
          v-model="message"
          placeholder="메시지를 입력하세요."
        /> <br>

        <hr>

        <!-- 이미지 -->
        <FormField
          label="이미지"
          name="file"
          type="file"
          v-model="image"
          @change="handleImgChange"
        /> <br>

        <!-- 미리보기 -->
        <p>미리보기</p>
        <img
          v-if="previewURL"
          :src="previewURL"
          alt="이미지 없음"
        >

      </fieldset>
      <SubmitButton>
        등록하기
      </SubmitButton>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { DesignerApi } from '@/api/designer';
import { useUserStore } from '@/stores/user';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 유저 정보 가져오기
const userStore = useUserStore();
const user_id = userStore.user.user_id;

// 라우터 생성
const router = useRouter();

// 입력창 변수
const experience = ref('');
const good_at = ref('');
const personality = ref('');
const message = ref('');
const image = ref(null);
const previewURL = ref('');

// 상태 관리 변수
const isSubmitting = ref(false);
const errorServerMsg = ref('');

// 이미지 등록
const handleImgChange = (e) => {
  image.value = e.target.files[0];
  previewURL.value = URL.createObjectURL(image.value);
}

// 디자이너 등록 함수
const handleCreate = async () => {
    // 오류 메시지 초기화
  errorServerMsg.value = "";

  // isSubmitting 활성화
  isSubmitting.value = true;

  try {
    // formData
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('experience', experience.value);
    formData.append('good_at', good_at.value);
    formData.append('personality', personality.value);
    formData.append('message', message.value);
    formData.append('image', image.value);

    // text 데이터 등록
    const res = await DesignerApi.create(formData);
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 던지기
    if (!body?.success) {
        throw new Error(body?.error?.message);
    }

    // 성공 메시지
    alert("디자이너 정보가 등록되었습니다.");

    // 성공 후 목록 페이지 이동
    router.push('/designer');
  } catch(e) {
    // 서버 오류 출력
    console.log(e.message);
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value)
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}

// 디자이너 목록 이동 함수
const goList = () => {
  router.push('/designer');
}

</script>