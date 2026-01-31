[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.2-yellow?logo=vue.js&logoColor=white)](https://pinia.vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.4-42b883)](https://router.vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

🌐 **한국어** | [日本語](README.md)

---

# CS25-3 미용실 예약 시스템 (Frontend)

![Logo](images/logo.png)

Vue 3 기반 미용실 예약 시스템 프론트엔드 프로젝트입니다.

## 시스템 아키텍처

![System Architecture](images/system-architecture.png)

## 주요 기능

### 메인 페이지
![Main Page](images/main.png)

### 예약 시스템
![Reservation](images/reservation.png)
![Reservation Demo](images/reservation.gif)

### 마이페이지

역할별 마이페이지를 제공합니다.

| 고객 | 디자이너 | 매니저 |
|------|----------|--------|
| ![Client](images/mypage-client.png) | ![Designer](images/mypage-designer.png) | ![Manager](images/mypage-manager.png) |

#### 게스트 마이페이지
![Guest Mypage Demo](images/mypage-guest.gif)

## 프로젝트 구조

```
v01/
├── src/
│   ├── api/           # API 통신 모듈
│   │   ├── client.js
│   │   ├── designer.js
│   │   ├── hairstyle.js
│   │   ├── news.js
│   │   ├── reservation.js
│   │   ├── salon.js
│   │   ├── service.js
│   │   ├── timeoff.js
│   │   └── users.js
│   ├── assets/        # 정적 리소스
│   ├── components/    # 공통 컴포넌트
│   │   ├── FormField.vue
│   │   ├── SubmitButton.vue
│   │   └── layout/
│   │       ├── Header.vue
│   │       ├── Footer.vue
│   │       └── MainHero.vue
│   ├── router/        # 라우터 설정
│   ├── stores/        # Pinia 스토어
│   ├── views/         # 페이지 컴포넌트
│   │   ├── designer/
│   │   ├── hairstyle/
│   │   ├── main/
│   │   ├── mypage/
│   │   ├── news/
│   │   ├── reservation/
│   │   ├── salon/
│   │   ├── service/
│   │   └── users/
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## ERD

![ERD](images/erd.png)

## 시작하기

### 설치

```bash
cd v01
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 기능 목록

- **사용자 관리**: 회원가입, 로그인, 정보 수정
- **예약 관리**: 예약 생성, 이전 예약 조회
- **디자이너 관리**: 디자이너 등록, 목록 조회, 정보 수정
- **헤어스타일 관리**: 헤어스타일 등록, 목록 조회, 상세 조회, 수정
- **뉴스/공지**: 뉴스 등록, 목록 조회, 상세 조회, 수정
- **살롱 정보**: 살롱 상세 정보, 정보 수정
- **서비스 관리**: 서비스 등록, 목록 조회, 수정
- **마이페이지**: 역할별 맞춤 마이페이지 (고객, 디자이너, 매니저)
