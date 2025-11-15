import { request } from "./client"

export const HairstyleApi = {
  // 전체 읽기
  async list() {
    try {
      const res = await request("GET", "/hairstyle");
      return res.data?.hairstyle ?? []; // res.data.hairstyle이 undefined면 빈 리스트 반환
    } catch(e) {
      console.log(e);
      throw e;
    }
  },
  // 작성하기
  create(payload) {
    return request("POST", "/hairstyle/create", payload);
  },
  // 수정하기
  update(hairstyle_id, payload) {
    return request("PUT", `/hairstyle/update/${encodeURIComponent(hairstyle_id)}`, payload);
  },
  // 삭제하기
  delete(hairstyle_id) {
    return request("DELETE", `/hairstyle/delete/${encodeURIComponent(hairstyle_id)}`);
  }
};
