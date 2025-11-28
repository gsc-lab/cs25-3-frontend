import { defineStore } from "pinia";

// 로그인 상태를 절대 브라우저에 저장하지 않는 userStore
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      user_id: 0,
      account: "guest",
      role: "guest",
      user_name: "guest",
    },
  }),

  persist: {
    storage: localStorage,
  },

  actions: {
    // 로그인 성공 시
    setUser(user) {
      this.user = user;
    },

    // 프론트 로그아웃 시 (Pinia 상태 초기화)
    logout() {
      this.user = {
        user_id: 0,
        account: "guest",
        role: "guest",
        user_name: "guest",
      };
    },

    // 세션 만료 등 강제 초기화
    reset() {
      this.logout();
    }
  },
});
