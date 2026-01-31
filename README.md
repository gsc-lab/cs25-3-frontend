[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.2-yellow?logo=vue.js&logoColor=white)](https://pinia.vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.4-42b883)](https://router.vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

🌐 [한국어](README_ko.md) | **日本語**

---

# CS25-3 美容室予約システム (Frontend)

![Logo](images/logo.png)

Vue 3ベースの美容室予約システムフロントエンドプロジェクトです。

## システムアーキテクチャ

![System Architecture](images/system-architecture.png)

## 主要機能

### メインページ
![Main Page](images/main.png)

### 予約システム
![Reservation](images/reservation.png)
![Reservation Demo](images/reservation.gif)

### マイページ

役割別のマイページを提供します。

| 顧客 | デザイナー | マネージャー |
|------|------------|--------------|
| ![Client](images/mypage-client.png) | ![Designer](images/mypage-designer.png) | ![Manager](images/mypage-manager.png) |

#### ゲストマイページ
![Guest Mypage Demo](images/mypage-guest.gif)

## プロジェクト構造

```
v01/
├── src/
│   ├── api/           # API通信モジュール
│   │   ├── client.js
│   │   ├── designer.js
│   │   ├── hairstyle.js
│   │   ├── news.js
│   │   ├── reservation.js
│   │   ├── salon.js
│   │   ├── service.js
│   │   ├── timeoff.js
│   │   └── users.js
│   ├── assets/        # 静的リソース
│   ├── components/    # 共通コンポーネント
│   │   ├── FormField.vue
│   │   ├── SubmitButton.vue
│   │   └── layout/
│   │       ├── Header.vue
│   │       ├── Footer.vue
│   │       └── MainHero.vue
│   ├── router/        # ルーター設定
│   ├── stores/        # Piniaストア
│   ├── views/         # ページコンポーネント
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

## はじめに

### インストール

```bash
cd v01
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### プロダクションビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## 機能一覧

- **ユーザー管理**: 会員登録、ログイン、情報修正
- **予約管理**: 予約作成、過去の予約照会
- **デザイナー管理**: デザイナー登録、一覧照会、情報修正
- **ヘアスタイル管理**: ヘアスタイル登録、一覧照会、詳細照会、修正
- **ニュース/お知らせ**: ニュース登録、一覧照会、詳細照会、修正
- **サロン情報**: サロン詳細情報、情報修正
- **サービス管理**: サービス登録、一覧照会、修正
- **マイページ**: 役割別カスタムマイページ（顧客、デザイナー、マネージャー）
