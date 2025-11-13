import { defineStore } from "pinia";

// 전역에서 로그인 상태를 관리하는 user 스토어 정의
export const useUserStore = defineStore("user", {
  // 상태(state): 실제 데이터 저장
  state: () => ({
    // 로그인한 사용자 정보 저장
    // 로그인 시: { user_id, account, role, user_name }
    // 로그아웃 시: null
    user: null,
  }),

  persist: {
    storage: localStorage, // or sessionStorage
  },

  // 동작(actions): 상태 변경 함수
  actions: {
    // 로그인 성공 시 user 데이터 저장
    setUser(user) {
      this.user = user;
    },

    // 로그아웃 시 user 삭제
    logout() {
      this.user = null;
    },
  },
});
