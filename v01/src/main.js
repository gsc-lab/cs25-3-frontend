// vue에서 createApp 함수 불러오기
import { createApp } from 'vue'

// pinia에서 createPinia 함수 불러오기
// store 생성용 함수 가져오기
import { createPinia } from 'pinia'

// 최상위 루트 컴포넌트로 사용 할 App.vue 파일 가져오기
import App from './App.vue'

// 라우터 설정 파일 가져오기
// import router from './router'

createApp(App)
  .use(createPinia())
//   .use(router)
  .mount('#app')

