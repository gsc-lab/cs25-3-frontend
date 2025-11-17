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
            // success, data
            return res.data;
        } catch(e) {
            console.log(e);
            throw e;
        }
    },
    // 등록하기
    async register(payload) {
        const res = await request(
            "POST",
            "/service/create",
            payload
        );
        // success, data
        return res.data;
    },
    // 수정하기
    async update(service_id, payload) {
        const res = await request(
            "PUT",
            `/service/update/${encodeURIComponent(service_id)}`,
            payload
        );
        // success, data
        return res.data;
    },
    // 삭제하기
    async delete(service_id) {
        const res = await request(
            "DELETE",
            `/service/delete/${encodeURIComponent(service_id)}`
        );
        // 백엔드에서 보내는 http_response_code 번호 반환
        return res.status;
    },
}
