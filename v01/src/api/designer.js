// ./client.js에서 request 함수 불러오기
import { request } from "./client";

// designer API
export const DesignerApi = {
    // 전체 보기
    // 사진 출력에 따른 async/await 처리
    async list() {
        try {
            const res = await request("GET", "/designer");
            return res.data?.designer ?? [];
        } catch(e) {
            console.log(e);
            throw e;
        }
    },
    // 자세히 보기
    detail(designer_id) {
        return request("GET", `/designer/${encodeURIComponent(designer_id)}`);
    },
    // 등록하기
    register(payload) {
        return request("POST", "/designer/create", payload);
    },
    // 수정하기
    update(designer_id, payload) {
        return request("PUT", `/designer/update/${encodeURIComponent(designer_id)}`, payload);
    },
    // 삭제 하기
    delete(designer_id) {
        return request("DELETE", `/designer/delete/${encodeURIComponent(designer_id)}`);
    },
}