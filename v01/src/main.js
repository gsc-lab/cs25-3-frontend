// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// 1. pinia 인스턴스 하나 생성
const pinia = createPinia();

// 2. 여기에 플러그인 붙이기
pinia.use(piniaPluginPersistedstate);

// 3. 이 pinia를 앱에 등록
app.use(pinia);
app.use(router);

app.mount("#app");