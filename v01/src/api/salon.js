import { request } from './client';

// salon API
export const SalonApi = {
  // 전체 조회
  async list() {
    const res = await request("GET", "/salon");
    return res.data;
  },

  // 수정하기
  async update(payload) {
    const res = await request("PUT", "/salon/update", payload);
    return res.data;
  },

  // 이미지 올리기
  async updateImage(formData) {
    const res = await request("POST", "/salon/image", formData);
    return res.data;
  }
};
