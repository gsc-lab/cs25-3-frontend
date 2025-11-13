// 공통 요청 함수 (client.js에서 axios 인스턴스로 정의)
import { request } from "./client"

// 사용자 관련 API 요청 모아둔 객체
// 각 메서드는 백엔드의 RESTful API 엔드포인트를 호출
export const UsersApi = {
  // 회원가입
  register(payload) {
    // payload: { account, password, name, ... }
    return request("POST", "/users", payload)
  },

  // 로그인
  login(payload) {
    // payload: { account, password }
    return request("POST", "/users/login", payload)
  },

  // 로그아웃
  logout() {
    // 서버 세션 또는 토큰 삭제
    return request("DELETE", "/users/logout")
  },

  // 특정 사용자 정보 조회
  get(account) {
    // account: 사용자 ID
    return request("GET", `/users/${encodeURIComponent(account)}`)
  },

  // 사용자 정보 수정
  update(account, payload) {
    // account: 사용자 ID, payload: 수정할 데이터 (예: { name, password })
    return request("PUT", `/users/${encodeURIComponent(account)}`, payload)
  },

  // 사용자 삭제
  remove(account) {
    // account: 삭제할 사용자 ID
    return request("DELETE", `/users/${encodeURIComponent(account)}`)
  },
}
