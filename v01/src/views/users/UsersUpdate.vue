<template>
  <div class="user_update">
    <h2 style="text-align: center;">MYPAGE</h2>

    <!-- 입력창 -->
    <form @submit.prevent="handleUpdate">
      <fieldset>
        <!-- 이름 -->
        <FormField
          label="NAME: "
          v-model="user_name"
          placeholder="이름을 입력하세요."
        /> <br>
        <!-- 아이디 -->
        <FormField
          label="ID: "
          v-model="account"
          placeholder="아이디를 입력하세요."
        /> <br>
        <!-- 비밀번호 -->
        <FormField
          label="PW: "
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력하세요."
        /> <br>
        <!-- 휴대전화 -->
        <FormField
          label="PHONE: "
          v-model="phone"
          placeholder="전화번호를 입력하세요."
        /> <br>
        <!-- 생년월일 -->
        <FormField
          label="BIRTH: "
          type="date"
          v-model="birth"
        />
      </fieldset>
      <SubmitButton
        :loading="isSubmitting"
      >
        수정하기
      </SubmitButton>
      <button
        type="button"
        @click="router.back()"
      >
        뒤로가기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UsersApi } from '@/api/users';
import { useUserStore } from '@/stores/user';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// 로그인 정보 불러오기
const userStore = useUserStore();

// 라우터 생성
const router = useRouter();

// 입력창 변수
const account = ref('');
const password = ref('');
const user_name = ref('');
const phone = ref('');
const birth = ref('');

// 상태 관리 변수
const isLoading = ref(false);
const isSubmitting = ref(false);
const errorServerMsg = ref('');

// 사용자 정보 불러오기
const fetchInfo = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isLoading 활성화
  isLoading.value = true;

  try {
    // 사용자 정보 불러오기
    const res = await UsersApi.detail();
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // 각 입력창 변수에 사용자 정보 저장
    account.value = userStore.user.account;
    user_name.value = body?.data?.user?.user_name;
    phone.value = body?.data?.user?.phone;
    birth.value = body?.data?.user?.birth;

  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message;
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

onMounted(fetchInfo);

// 사용자 정보 수정
const handleUpdate = async () => {
  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isSubmitting 활성화
  isSubmitting.value = true;

  // payload
  const payload = {
    user_name: user_name.value,
    account: account.value,
    password: password.value,
    phone: phone.value,
    birth: birth.value
  }

  try {
    // UsersApi.update(payload)
    const res = await UsersApi.update(payload);
    const body = res.data;

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // 수정 성공 시
    // 성공 메시지 출력 후 마이페이지 이동
    alert("회원님의 정보가 수정되었습니다.");
    router.push('/mypage');
  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e?.response?.data?.error?.message || e?.message;
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}
</script>