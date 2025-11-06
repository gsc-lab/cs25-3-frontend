# 체크리스트
- [ ] 코드가 정상적으로 동작하나요?
- [ ] main이 아닌 feature/develop 브랜치에서 작업했나요?
- [ ] 브랜치 이름이 명확하고 규칙에 맞나요? (예: feature/fe-add-router)
- [ ] 커밋 메시지가 일관되고 의미 있게 작성되었나요?
- [ ] 변경된 UI/컴포넌트가 정상적으로 렌더링되나요?
- [ ] 기존 기능에 영향을 주지 않나요?

---

# 변경 사항 요약
> 이번 PR에서 구현하거나 수정한 내용을 요약해주세요.

**예시**
- Vue Router 초기 설정 추가 (`src/router/index.js`)
- `App.vue`에 `<router-view>` 추가
- `/students` 페이지 이동 테스트용 라우트 등록
- 라우터 관련 주석 추가

---

# 상세 변경 내용
> 파일 단위로 주요 변경 사항을 정리해주세요.

**예시**
- `src/router/index.js` : `createWebHistory()` 기반 기본 라우터 추가  
- `src/main.js` : `createApp()`에서 `.use(router)` 적용  
- `src/views/Main.vue` : 메인 페이지 컴포넌트 생성  
- `src/App.vue` : `<router-view>` 추가로 라우트 출력 구조 확립