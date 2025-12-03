<template>
  <div class="page">
    <h2>MYPAGE</h2>

    <h3>회원 정보 변경</h3>

    <!-- form -->
    <div class="form-container">
      <form @submit.prevent="handleUpdate" class="user-form">
        <fieldset>
          <!-- 이름 -->
          <FormField
            label="이름"
            v-model="user_name"
            placeholder="이름을 입력하세요."
          />
          <!-- 아이디 -->
          <FormField
            label="아이디"
            v-model="account"
            placeholder="아이디를 입력하세요."
            :disabled="true" 
          />
          <!-- 비밀번호 -->
          <FormField
            label="비밀번호"
            type="password"
            v-model="password"
            placeholder="변경할 비밀번호를 입력하세요."
          />
          <!-- 휴대전화 -->
          <FormField
            label="휴대전화"
            v-model="phone"
            placeholder="전화번호를 입력하세요."
          />
        </fieldset>

        <!-- 버튼 -->
        <div class="form-actions">
          <!-- 수정하기 버튼 -->
          <SubmitButton :loading="isSubmitting">
            수정하기
          </SubmitButton>
          <!-- 뒤로가기 버튼 -->
          <button
            type="button"
            class="btn-secondary"
            @click="router.back()"
          >
            뒤로가기
          </button>
        </div>
      </form>
    </div>
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
    // account 값은 스토어보다 실제 DB에서 가져온 값을 우선하는 것이 좋습니다.
    account.value = body?.data?.user?.account || userStore.user.account; 
    user_name.value = body?.data?.user?.user_name;
    phone.value = body?.data?.user?.phone;

  } catch(e) {
    // 서버 오류 메시지 출력
    errorServerMsg.value = e.response?.data?.error?.message || e.message || "정보를 불러오는데 실패했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isLoading 비활성화
    isLoading.value = false;
  }
}

onMounted(fetchInfo);

// 사용자 정보 수정
const handleUpdate = async () => {
  
  // 간단한 유효성 검사 (예시)
  if(!user_name.value || !phone.value) {
      alert("이름과 전화번호는 필수 입력사항입니다.");
      return;
  }

  // 오류 메시지 초기화
  errorServerMsg.value = '';

  // isSubmitting 활성화
  isSubmitting.value = true;

  // payload
  // 비밀번호가 입력되지 않았다면 payload에서 제외하는 로직이 필요할 수 있습니다.
  // 현재는 입력된 그대로 전송합니다.
  const payload = {
    user_name: user_name.value,
    account: account.value,
    password: password.value,
    phone: phone.value
  }

  try {
    // UsersApi.update(payload)
    const res = await UsersApi.update(payload);
    const body = res.data;

    // response.data.success가 false인 경우
    if (body.success === false) {
      throw new Error(body?.error?.message);
    }

    // 수정 성공 시
    alert("회원님의 정보가 수정되었습니다.");
    router.push('/mypage');
  } catch(e) {
    // 서버 오류 메시지 출력
    console.error(e);
    errorServerMsg.value = e?.response?.data?.error?.message || e?.message || "수정에 실패했습니다.";
    alert(errorServerMsg.value);
  } finally {
    // isSubmitting 비활성화
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 40px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Noto Sans KR", sans-serif;
  font-size: 14px;
  color: #333;
}

.page > h2 {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}

.page h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
}

.form-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 3px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

fieldset {
  border: none;
  padding: 0;
  margin: 0 0 30px 0;
}

fieldset > * {
    margin-bottom: 40px;
}
fieldset > *:last-child {
    margin-bottom: 0;
}

fieldset :deep(label) {
    display: block;
    font-weight: 600;
    color: #555;
    margin-bottom: 8px;
    font-size: 15px;
}

fieldset :deep(input) {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 1px;
    font-size: 15px;
    transition: all 0.2s ease;
    box-sizing: border-box;
}

fieldset :deep(input:focus) {
    outline: none;
    border-color: #a8a6a4;
    box-shadow: 0 0 0 2px rgba(168, 166, 164, 0.2);
}

fieldset :deep(input:disabled) {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.form-actions :deep(button) {
    padding: 10px 20px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 2px;
    background-color: #a8a6a4;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-width: 100px;
}

.form-actions :deep(button:hover) {
    background-color: #cfbdaa;
}

.form-actions :deep(button:disabled) {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>