// ./client.js에서 request 함수 불러오기
import { request } from "./client";

// designer API
export const DesignerApi = {
    // 전체 보기
    // 초기 로딩 실패 처리를 위한 try-catch
    async list() {
        try {
            const res = await request(
                "GET",
                "/designer"
            );
            // success, data
            return res.data;
        } catch(e) {
            console.log(e);
            throw e;
        }
    },
    // 자세히 보기
    async detail(designer_id) {
        const res = await request(
            "GET",
            `/designer/${encodeURIComponent(designer_id)}`
        );
        // success, data
        return res.data;
    },
    // 등록하기
    async register(payload) {
        const res = await request(
            "POST",
            "/designer/create",
            payload
        );
        // success, data
        return res.data;
    },
    // 수정하기
    async update(designer_id, payload) {
        const res = await request(
            "PUT",
            `/designer/update/${encodeURIComponent(designer_id)}`,
            payload
        );
        // success, data
        return res.data;
    },
    // 삭제 하기
    async delete(designer_id) {
        const res = await request("DELETE",
            `/designer/delete/${encodeURIComponent(designer_id)}`
        );
        // 백엔드에서 넘겨주는 http_response_code 번호 반환
        return res.status;
    },
}