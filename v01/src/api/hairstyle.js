// src/api/hairstyle.js
import { request } from "./client";

export const HairstyleApi = {
  // 전체 읽기
  async list() {
    const res = await request("GET", "/hairstyle");
    // 백엔드 응답: { success: true, data: { hairstyle: [...] } }
    return res.data;
  },

  // 세부 읽기
  async get(hair_id) {
    const res = await request("GET", `/hairstyle/${encodeURIComponent(hair_id)}`);
    return res.data;
  },

  // 작성하기 (이미지 포함, FormData)
  async create(formData) {
    const res = await request("POST", "/hairstyle/create", formData);
    // 컴포넌트에서 res.success 이렇게 쓰려고 data만 넘김
    return res;
  },

  // 텍스트 정보 수정 (제목/설명) – JSON body
  async update(hair_id, payload) {
    const res = await request(
      "PUT",
      `/hairstyle/update/${encodeURIComponent(hair_id)}`,
      payload
    );
    // { success: true, data: { hairstyle: {...} } }
    return res.data;
  },

  // 이미지 교체 (선택) – FormData(image)
  async updateImage(hair_id, formData) {
    const res = await request(
      "POST",
      `/hairstyle/${encodeURIComponent(hair_id)}/image`,
      formData
    );
    return res.data;
  },

  // 삭제
  async delete(hair_id) {
    const res = await request(
      "DELETE",
      `/hairstyle/delete/${encodeURIComponent(hair_id)}`
    );

    // 백엔드에서 204 보내는 구조 → 상태코드만 돌려줘도 됨
    return res.status;
  },
};
