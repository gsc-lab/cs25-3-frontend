import { request } from "./client";

// reservation API
export const ReservationApi = {

  // 예약 목록 조회
  async list() {
    try {
      const res = await request(
        "GET",
        "/reservation"
      );
      return res.data; // success, data
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 생성하기
  async create(payload) {
    const res = await request(
      "POST",
      "/reservation",
      payload
    );
    return res;
  },

  // 취소하기
  async cancel(reservation_id, cancel_reason) {
    const res = await request(
      "PUT",
      `/reservation/update/${encodeURIComponent(reservation_id)}`,
      { cancel_reason }
    );
    return res.data;
  },

  // 예약 상태 수정하기
  async updateStatus(reservation_id, status) {
    const res = await request(
      "PUT",
      `/reservation/update/${encodeURIComponent(reservation_id)}`,
      { status }
    );
    return res.data;
  }
};
