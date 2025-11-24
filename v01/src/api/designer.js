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
            // header, status, data
            return res;
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
        // header, status, data
        return res;
    },
    // 등록하기
    async create(formData) {
        const res = await request(
            "POST",
            "/designer/create",
            formData
        );
        // header, status, data
        return res;
    },
    // 수정하기
    async update(designer_id, payload) {
        const res = await request(
            "PUT",
            `/designer/update/${encodeURIComponent(designer_id)}`,
            payload
        );
        // header, status, data
        return res;
    },
    // 이미지 
    async updateFile(designer_id, formData) {
        const res = await request(
            "POST",
            `/designer/file/${encodeURIComponent(designer_id)}`,
            formData
        );
        // header, status, data
        return res;
    },
    // 삭제 하기
    async delete(designer_id) {
        const res = await request("DELETE",
            `/designer/delete/${encodeURIComponent(designer_id)}`
        );
        // header, status, data
        return res;
    },
}