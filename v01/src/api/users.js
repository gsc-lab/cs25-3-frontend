// ./client.js에서 request 함수 불러오기
import { request } from "./client"

// users API
export const UsersApi = {
  // 회원가입
  async register(payload) {
    const res = await request("POST", "/users/create", payload);
    return res;
  },
  
  // 로그인
  async login(payload) {
    const res = await request("POST", "/users/login", payload);
    return res;
  },

  // 특정 사용자 정보 조회
  async detail() {
    const res = await request("GET", "/users");
    return res;
  },

  // 사용자 정보 수정
  async update(payload) {
    const res = await request(
      "PUT",
      "/users/update",
      payload
    );
    return res;
  },

  // 사용자 삭제
  async delete() {
    const res = await request(
      "DELETE",
      "/users/delete"
    );
    return res;
  },

  // 로그아웃
  async logout() {
    const res = await request("POST", "/users/logout");
    return res;
  },
}