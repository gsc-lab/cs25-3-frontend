<template>
  <div class="page-wrapper">
    <section class="login-container">
      <h2 class="login-title">LOGIN</h2>

      <!-- form -->
      <form @submit.prevent="onSubmit" class="login-form">
        <div class="role-selection">
          <label class="section-label">Role</label>
          <div class="radio-group">
            <!-- Client -->
            <FormField
              type="radio"
              name="role"
              label="Client"
              v-model="form.role"
              value="client"
            />
            <!-- Designer -->
            <FormField
              type="radio"
              name="role"
              label="Designer"
              v-model="form.role"
              value="designer"
            />
            <!-- Manager -->
            <FormField
              type="radio"
              name="role"
              label="Manager"
              v-model="form.role"
              value="manager"
            />
          </div>
        </div>

        <div class="divider"></div>

        <div class="input-wrapper">
          <!-- ID -->
          <FormField
            label="ID"
            v-model="form.account"
            autocomplete="username"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div class="input-wrapper">
          <!-- PASSWORD -->
          <FormField
            label="PASSWORD"
            type="password"
            v-model="form.password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <!-- 버튼 -->
        <div class="btn-area">
          <!-- 로그인 버튼 -->
          <SubmitButton :loading="isLoading" class="login-submit">
            로그인
          </SubmitButton>
        </div>
      </form>

      <p class="login-footer">
        아직 계정이 없나요?
        <router-link to="/users/create" class="login-link">회원가입</router-link>
      </p>
    </section>
  </div>
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
    if (!res.data?.success) {
      throw new Error(res.data?.error?.message || "로그인에 실패했습니다.");
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

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-container {
  width: 100%;
  max-width: 700px;
  padding: 20px;
  background-color: #fff;
  color: #333;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 40px;
  color: #222;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.role-selection {
  margin-bottom: 20px;
  text-align: center;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.radio-group {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0 25px 0;
}

.input-wrapper {
  margin-bottom: 20px;
}

:deep(label) {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

:deep(input[type="text"]),
:deep(input[type="password"]) {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  transition: all 0.3s;
}

:deep(input:focus) {
  outline: none;
  border-color: #a8a6a4;
  box-shadow: 0 0 0 2px rgba(168, 166, 164, 0.1);
}

.btn-area {
  margin-top: 10px;
}

:deep(button) {
  width: 100%;
  padding: 14px;
  background-color: #a8a6a4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

:deep(button:hover) {
  background-color: #cfbdaa;
}

:deep(button:disabled) {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.login-link {
  color: #a8a6a4;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
}

.login-link:hover {
  text-decoration: underline;
  color: #888;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
  .page-wrapper {
    background-color: #fff;
    align-items: flex-start;
    padding-top: 40px;
  }
}
</style>