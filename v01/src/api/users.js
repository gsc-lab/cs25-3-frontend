// ./client.js에서 request 함수 불러오기
import { request } from "./client"

// users API
export const UsersApi = {
  // 회원가입
  register(payload) {
    return request("POST", "/users/create", payload)
  },
  // 로그인
  login(payload) {
    return request("POST", "/users/login", payload)
  },
  // 특정 사용자 정보 조회
  detail(account) {
    return request("GET", `/users/detail/${encodeURIComponent(account)}`)
  },
  // 사용자 정보 수정
  update(account, payload) {
    return request("PUT", `/users/update/${encodeURIComponent(account)}`, payload)
  },
  // 사용자 삭제
  remove(account) {
    return request("DELETE", `/users/delete/${encodeURIComponent(account)}`)
  },
  // 로그아웃
  logout() {
    return request("DELETE", "users/logout")
  },
}
