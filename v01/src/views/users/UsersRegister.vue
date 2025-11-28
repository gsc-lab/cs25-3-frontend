<template>
  <section class="page">
    <h2 class="title">회원가입</h2>

    <form class="form" @submit.prevent="onSubmit">
      <!-- ROLE -->
      ROLE:
      <FormField
        label="client"
        name="role"
        type="radio"
        v-model="form.role"
        value="client"
      />

      <FormField
        label="designer"
        name="role"
        type="radio"
        v-model="form.role"
        value="designer"
      />

      <FormField
        label="manager"
        name="role"
        type="radio"
        v-model="form.role"
        value="manager"
      />

      <p v-if="errors.role" class="form-error">{{ errors.role }}</p>

      <hr>

      <!-- ID -->
      <FormField
        label="ID: "
        v-model="form.account"
        autocomplete="username"
        :error="errors.account"
      />
      <br>

      <!-- PW -->
      <FormField
        label="PW: "
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <br>

      <!-- NAME -->
      <FormField
        label="NAME: "
        v-model="form.user_name"
        autocomplete="name"
        :error="errors.user_name"
      />
      <br>

      <!-- GENDER -->
      GENDER:
      <FormField
        label="man"
        name="gender"
        type="radio"
        v-model="form.gender"
        value="man"
      />

      <FormField
        label="woman"
        name="gender"
        type="radio"
        v-model="form.gender"
        value="woman"
      />

      <p v-if="errors.gender" class="form-error">{{ errors.gender }}</p>
      
      <br>

      <!-- PHONE -->
      <FormField
        label="PHONE: "
        type="tel"
        v-model="form.phone"
        autocomplete="tel"
        :error="errors.phone"
      />
      <br>

      <!-- BIRTH -->
      <FormField
        label="BIRTH: "
        type="date"
        v-model="form.birth"
        autocomplete="bday"
        :error="errors.birth"
      />
      <br>

      <p v-if="serverError" class="msg error">{{ serverError }}</p>
      <p v-if="serverOK" class="msg ok">가입이 완료되었습니다. 로그인 해주세요.</p>

      <SubmitButton :loading="loading">가입하기</SubmitButton>
    </form>

    <p class="link">
      이미 계정이 있나요?
      <RouterLink to="/users/login">로그인</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UsersApi } from "@/api/users";
import FormField from "@/components/FormField.vue";
import SubmitButton from "@/components/SubmitButton.vue";

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

  // errors 객체에서 values 값만 뽑아내서 values 값들이 모두 ""을 만족하는지 검사
  // 만족할 경우 true, 만족하지 않을 경우 false 반환
  return Object.values(errors).every(v => v === "");
}

async function onSubmit() {
  serverError.value = "";
  serverOK.value = false;

  // 에러가 하나라도 있을 경우 제출 로직 종료
  if (!validate()) return;

  loading.value = true;   // 로딩 시작

  try {
    // HTTP request 및 response
    await UsersApi.register({
      account:   form.account,
      user_name: form.user_name,
      password:  form.password,
      role:      form.role,
      gender:    form.gender,
      phone:     form.phone,
      birth:     form.birth,
    });

    // 성공했다면
    serverOK.value = true;

    // 바로 로그인 페이지로 이동
    router.push("/users/login");
  } catch (e) {
    const data = e?.response?.data;

    // 서버에서 작성한 오류 출력
    const msg = data?.error?.message;
    serverError.value = msg;
  } finally {
    loading.value = false;  // 로딩 종료
  }
}
</script>
