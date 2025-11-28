import { request } from './client';

// salon API
export const SalonApi = {
  // 전체 조회
  async list() {
    const res = await request("GET", "/salon");
    return res.data;
  },

  // 수정하기
  async update(formData) {
    const res = await request("PUT", "/salon/update", formData);
    return res.data;
  }
};
