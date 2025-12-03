<template>
  <div class="page-wrapper">
    <section class="signup-container">
      <h2 class="signup-title">SIGN UP</h2>

      <!-- form -->
      <form class="signup-form" @submit.prevent="onSubmit">
        <fieldset class="field-group">
          <legend class="section-label">Role</legend>
          <div class="radio-group">
            <!-- Client -->
            <FormField
              label="Client"
              name="role"
              type="radio"
              v-model="form.role"
              value="client"
            />
            <!-- Designer -->
            <FormField
              label="Designer"
              name="role"
              type="radio"
              v-model="form.role"
              value="designer"
            />
            <!-- Manager -->
            <FormField
              label="Manager"
              name="role"
              type="radio"
              v-model="form.role"
              value="manager"
            />
          </div>
          <p v-if="errors.role" class="form-error">{{ errors.role }}</p>
        </fieldset>

        <div class="divider"></div>

        <div class="input-area">
          <div class="input-wrapper">
            <!-- ID -->
            <FormField
              label="ID"
              v-model="form.account"
              autocomplete="username"
              placeholder="아이디를 입력하세요"
              :error="errors.account"
            />
          </div>

          <div class="input-wrapper">
            <!-- PASSWORD -->
            <FormField
              label="PASSWORD"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              placeholder="비밀번호를 입력하세요 (8자 이상)"
              :error="errors.password"
            />
          </div>

          <div class="input-wrapper">
            <!-- NAME -->
            <FormField
              label="NAME"
              v-model="form.user_name"
              autocomplete="name"
              placeholder="이름을 입력하세요"
              :error="errors.user_name"
            />
          </div>
        </div>

        <div class="divider"></div>

        <fieldset class="field-group">
          <legend class="section-label">Gender</legend>
          <div class="radio-group">
            <!-- radio -->
            <FormField
              label="Man"
              name="gender"
              type="radio"
              v-model="form.gender"
              value="man"
            />
            <FormField
              label="Woman"
              name="gender"
              type="radio"
              v-model="form.gender"
              value="woman"
            />
          </div>
          <p v-if="errors.gender" class="form-error">{{ errors.gender }}</p>
        </fieldset>

        <div class="input-area">
            <div class="input-wrapper">
              <!-- PHONE -->
                <FormField
                label="PHONE"
                type="tel"
                v-model="form.phone"
                autocomplete="tel"
                placeholder="전화번호를 입력하세요"
                :error="errors.phone"
                />
            </div>

            <div class="input-wrapper">
                <!-- BIRTH -->
                <FormField
                label="BIRTH"
                type="date"
                v-model="form.birth"
                autocomplete="bday"
                :error="errors.birth"
                />
            </div>
        </div>

        <div class="message-area">
            <!-- 서버 오류 메시지 -->
            <p v-if="serverError" class="msg error">{{ serverError }}</p>
            <p v-if="serverOK" class="msg ok">가입이 완료되었습니다. 로그인 해주세요.</p>
        </div>

        <div class="btn-area">
            <!-- 가입하기 버튼 -->
            <SubmitButton :loading="loading" class="submit-btn">
                가입하기
            </SubmitButton>
        </div>
      </form>

      <p class="signup-footer">
        이미 계정이 있나요?
        <RouterLink to="/users/login" class="link">로그인</RouterLink>
      </p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UsersApi } from "@/api/users";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

// 라우터 생성
const router = useRouter();

// 폼 상태
const form = reactive({
  account: "",
  password: "",
  user_name: "",
  role: "",
  gender: "",
  phone: "",
  birth: "",
});

// 각 필드별 에러 메시지
const errors = reactive({
  account: "",
  password: "",
  user_name: "",
  role: "",
  gender: "",
  phone: "",
  birth: "",
});

// 상태 관리 변수
const serverError = ref("");
const serverOK = ref(false);
const loading = ref(false);

// 클라이언트 검증
function validate() {
  errors.account   = form.account ? "" : "계정을 입력하세요.";
  errors.password  =
    form.password && form.password.length >= 8
      ? ""
      : "비밀번호는 8자 이상이어야 합니다.";
  errors.user_name = form.user_name ? "" : "이름을 입력하세요.";
  errors.role      = form.role ? "" : "역할을 선택하세요.";
  errors.gender    = form.gender ? "" : "성별을 선택하세요.";

  return Object.values(errors).every(v => v === "");
}

// 제출 로직
async function onSubmit() {
  serverError.value = "";
  serverOK.value = false;

  // 빈 값이 있을 경우 제출 로직 종료
  if (!validate()) return;

  // loading 활성화
  loading.value = true;

  try {
    // UsersApi.register(payload)
    await UsersApi.register({
      account:   form.account,
      user_name: form.user_name,
      password:  form.password,
      role:      form.role,
      gender:    form.gender,
      phone:     form.phone,
      birth:     form.birth,
    });

    // serverOK 활성화 후 로그인 페이지 이동
    serverOK.value = true;
    router.push("/users/login");
  } catch (e) {
    const data = e?.response?.data;
    const msg = data?.error?.message || "회원가입 중 오류가 발생했습니다.";
    // 서버 오류 메시지 출력
    serverError.value = msg;
    alert(msg);
  } finally {
    // loading 비활성화
    loading.value = false;
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

.signup-container {
  width: 100%;
  max-width: 700px;
  padding: 20px;
  color: #333;
}

.signup-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 40px;
  color: #222;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

.field-group {
    border: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.section-label {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 10px;
    display: block;
}

.radio-group {
    display: flex;
    gap: 20px;
    margin-bottom: 5px;
}

.divider {
    height: 1px;
    background-color: #eee;
    margin: 10px 0 25px 0;
}

.input-area {
    margin-bottom: 10px;
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
:deep(input[type="password"]),
:deep(input[type="tel"]),
:deep(input[type="date"]) {
  width: 100%;
  padding: 12px;
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

.form-error {
    color: #d9534f;
    font-size: 13px;
    margin-top: 5px;
}
.msg.error {
    color: #d9534f;
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
}
.msg.ok {
    color: #5cb85c;
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
}

.btn-area {
    margin-top: 20px;
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

.signup-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.link {
  color: #a8a6a4;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
}

.link:hover {
  text-decoration: underline;
  color: #888;
}

@media (max-width: 600px) {
  .signup-container {
    padding: 30px 20px;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
  .page-wrapper {
      background-color: #fff;
      padding-top: 20px;
      align-items: flex-start;
  }
}
</style>