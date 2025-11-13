<template>
  <!-- 로그인 박스 -->
  <section class="login-container">
    <h1 class="login-title">로그인</h1>

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

      <p v-if="errors.role" class="form-error">{{ errors.role }}</p>

      <hr>

      <!-- ID 입력 박스 -->
      <FormField
        label="ID"
        v-model="form.account"
        autocomplete="username"
        class="login-field"
        :error="errors.account"
      />

      <br>

      <!-- PW 입력 박스 -->
      <FormField
        label="PW"
        type="password"
        v-model="form.password"
        autocomplete="current-password"
        class="login-field"
        :error="errors.password"
      />

      <br>

      <!-- 서버에서 온 공통 에러 -->
      <p v-if="serverError" class="msg error">{{ serverError }}</p>

      <SubmitButton :loading="loading" class="login-submit">
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
import { UsersApi } from "@/api/users";   // 👈 로그인 API
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  role: "client",
  account: "",
  password: "",
});

// 필드별 에러
const errors = reactive({
  role: "",
  account: "",
  password: "",
});

// 공통 서버 에러
const serverError = ref("");

const loading = ref(false);

// 간단 클라이언트 검증
function validate() {
  errors.role    = form.role ? "" : "역할을 선택하세요.";
  errors.account = form.account ? "" : "ID를 입력하세요.";
  errors.password = form.password ? "" : "비밀번호를 입력하세요.";

  return Object.values(errors).every((v) => v === "");
}

async function onSubmit() {
  // 이전 에러 초기화
  serverError.value = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));

  if (!validate()) return;

  loading.value = true;
  try {
    // 1) 서버에 로그인 요청 (아이디/비번 검증 + 세션 생성)
    const res = await UsersApi.login({
      role: form.role,
      account: form.account,
      password: form.password,
    });

    console.log("login response:", res.data);

    // 2) 응답에서 user 정보 꺼내서 전역 스토어에 저장
    const user = res.data.user;
    userStore.setUser(user);

    // 3) 마이페이지로 이동
    router.push("/mypage");
  } catch (e) {
    const payload = e?.data ?? {};

    // { error: "로그인 실패 메시지" }
    if (payload.error) {
      serverError.value = payload.error;
    }

    // { errors: { account: "...", password: "..." } }
    if (payload.errors && typeof payload.errors === "object") {
      for (const [field, msg] of Object.entries(payload.errors)) {
        if (field in errors) {
          errors[field] = Array.isArray(msg) ? msg.join(", ") : String(msg);
        }
      }
      if (!serverError.value) {
        serverError.value = "입력값을 확인해 주세요.";
      }
    }

    console.debug("login error:", payload);
  } finally {
    loading.value = false;
  }
}
</script>
