<template>
  <section class="page">
    <h1 class="title">회원가입</h1>

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
  role: "",      // 라디오 단일 선택
  gender: "",    // 라디오 단일 선택
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
  // phone / birth는 필요하면 여기서 추가 검증

  return Object.values(errors).every((v) => v === "");
}

async function onSubmit() {
  serverError.value = "";
  serverOK.value = false;

  if (!validate()) return;

  loading.value = true;
  try {
    await UsersApi.register({
      account:   form.account,
      user_name: form.user_name,
      password:  form.password,
      role:      form.role,
      gender:    form.gender,
      phone:     form.phone,
      birth:     form.birth,
    });

    serverOK.value = true;
    // 가입 후 바로 로그인 페이지로 이동
    router.push("/users/login");
  } catch (e) {
    // e = { status, data }  ← 인터셉터에서 가공된 형태라고 가정
    const status  = e?.status ?? 0;
    const payload = e?.data ?? {};

    // 1) 공통 에러 메시지: { error: "메시지" }
    if (payload.error) {
      serverError.value = payload.error;
    }

    // 2) 필드별 에러: { errors: { account: "...", password: "...", ... } }
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

    console.debug("register error:", { status, payload });
  } finally {
    loading.value = false;
  }
}
</script>