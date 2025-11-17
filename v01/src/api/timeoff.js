import { request } from "./client";

// timeoff API
export const TimeoffApi = {
    // 전체 목록 출력
    // 초기 로딩 실패 처리를 위한 try-catch 사용
    async list() {
        try {
            const res = await request(
            "GET",
            "/timeoff",
            );
            // success, data
            return res.data;
        } catch(e) {
            console.log(e);
            throw e;
        }
    },
    // 작성하기
    async create(payload) {
        const res = await request(
            "POST",
            "/timeoff/create",
            payload
        );
        // success, data
        return res.data;
    },
    // 수정하기
    async update(designer_id, payload) {
        const res = await request(
            "PUT",
            `/timeoff/update/${designer_id}`,
            payload
        );
        // success, data
        return res.data;
    },
    // 삭제하기
    async delete(to_id) {
        const res = await request(
            "DELETE",
            `/timeoff/delete/${to_id}`
        );
        // 백엔드에서 받아온 http_response_code 번호 반환
        return res.status;
    }
}