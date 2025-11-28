// src/api/hairstyle.js
import { request } from "./client";

export const HairstyleApi = {
  // 전체 읽기
  async list() {
    try {
      const res = await request(
      "GET",
      "/hairstyle"
    );
    // success, data
    return res.data;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  },
  // 세부 읽기
  async get(hair_id) {
    const res = await request(
      "GET",
      `/hairstyle/${encodeURIComponent(hair_id)}`
    );
    // success, data
    return res.data;
  },
  // 작성하기 (이미지 포함, FormData)
  async create(formData) {
    const res = await request(
      "POST",
      "/hairstyle/create",
      formData
    );
    // success, data
    return res.data;
  },
  // 이미지 교체 – FormData(image)
  async updateImage(hair_id, formData) {
    const res = await request(
      "POST",
      `/hairstyle/image/${encodeURIComponent(hair_id)}`,
      formData
    );
    // success, data
    return res.data;
  },
  // 텍스트 정보 수정 (제목/설명) – JSON body
  async update(hair_id, payload) {
    const res = await request(
      "PUT",
      `/hairstyle/update/${encodeURIComponent(hair_id)}`,
      payload
    );
    // success, data
    return res.data;
  },
  // 삭제하기
  async delete(hair_id) {
    const res = await request(
      "DELETE",
      `/hairstyle/delete/${encodeURIComponent(hair_id)}`
    );
    // 백엔드에서 넘겨주는 http_response_code 번호 반환
    return res.status;
  },
  // 메인 페이지 최신
  async mainHairstyle(limit = 6) {
    const res = await request(
      "GET",
      `/hairstyle?limit=${limit}`
    );
    return res;
  },
};
