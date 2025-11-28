<template>
  <!-- 로그인 박스 -->
  <section
    class="login-container"
    style="text-align: center;"
  >
    <h2 class="login-title">로그인</h2>

    <form @submit.prevent="onSubmit" class="login-form">
      Role:
      <FormField
        type="radio"
        name="role"
        label="client"
        v-model="form.role"
        value="client"
      />
      <FormField
        type="radio"
        name="role"
        label="designer"
        v-model="form.role"
        value="designer"
      />
      <FormField
        type="radio"
        name="role"
        label="manager"
        v-model="form.role"
        value="manager"
      />

      <hr />

      <!-- ID 입력 박스 -->
      <FormField
        label="ID: "
        v-model="form.account"
        autocomplete="username"
        class="login-field"
      />

      <br />

      <!-- PW 입력 박스 -->
      <FormField
        label="PW: "
        type="password"
        v-model="form.password"
        autocomplete="current-password"
        class="login-field"
      />

      <br />

      <SubmitButton :loading="isLoading" class="login-submit">
        로그인
      </SubmitButton>
    </form>

    <p class="login-footer">
      아직 계정이 없나요?
      <router-link to="/users/create" class="login-link">회원가입</router-link>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { UsersApi } from "@/api/users";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

// 사용자 정보 가져오기
const userStore = useUserStore();

// 라우터 생성
const router = useRouter();

// 입력창 변수
const form = reactive({
  role: "client",
  account: "",
  password: "",
});

// 상태 관리 변수
const serverError = ref("");
const isLoading = ref(false);

async function onSubmit() {
  // 오류 메시지 초기화
  serverError.value = "";

  // isLoading 활성화
  isLoading.value = true;

  try {
    // payload
    const payload = {
      role: form.role,
      account: form.account,
      password: form.password,
    }

    // 서버에 로그인 요청
    const res = await UsersApi.login(payload);

    // response.data.success가 false인 경우
    // 에러 메시지 던지기
    if (!res.data?.success) {
      throw new Error(res.data?.error?.message);
    }
 
    // 응답에서 user 정보 꺼내서 전역 스토어에 저장
    const user = res.data.data.user;
    userStore.setUser(user);

    // 로그인 성공 메시지
    alert("로그인에 성공했습니다!");

    // 메인 페이지 이동
    router.push('/');

  } catch (e) {
    // 서버 오류 메시지 출력
    serverError.value = e?.response?.data?.error?.message || e?.message;
    alert(serverError.value);
  } finally {
    isLoading.value = false;
  }
}
</script>
