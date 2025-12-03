// ./client.js에서 request 함수 불러오기
import { request } from "./client.js";

// service API
export const ServiceApi = {
    // 전체 보기
    // 초기 로딩 실패 처리를 위한 try-catch 사용
    async list() {
        try {
            const res = await request(
                "GET",
                "/service"
            );
            // data, status, header, ...
            return res;
        } catch(e) {
          console.log(e);
          throw e;
        }
    },
    // 세부 보기
    async show(service_id) {
        try {
            const res = await request(
                "GET",
                `/service/${service_id}`
            );
            // data, status, header, ...
            return res;
        } catch(e) {
            console.log(e);
            throw(e);
        }
    },
    // 등록하기
    async create(payload) {
        const res = await request(
            "POST",
            "/service/create",
            payload
        );
        // data, status, header, ...
        return res;
    },
    // 수정하기
    async update(service_id, payload) {
        const res = await request(
            "PUT",
            `/service/update/${encodeURIComponent(service_id)}`,
            payload
        );
        // success, data
        return res;
    },
    // 삭제하기
    async delete(service_id) {
        const res = await request(
            "DELETE",
            `/service/delete/${encodeURIComponent(service_id)}`
        );
        // data, status, header, ...
        return res;
    },
}
