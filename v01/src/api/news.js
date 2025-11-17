// ./client.js에서 request 함수 불러오기
import { request } from './client';

// news API
export const NewsAPI = {
    // 전체 보기
    async list() {
        const res = await request(
            "GET",
            "/news"
        );
        // success, data
        return res.data;
    },
    // 상세 보기
    async detail(news_id) {
        const res = await request(
            "GET",
            `/news/${encodeURIComponent(news_id)}`
        );
        // success, data
        return res.data;
    },
    // 작성하기
    async create(payload) {
        const res = await request(
            "POST",
            "/news/create",
            payload
        );
        // success, data
        return res.data;
    },
    // 수정하기
    async update(news_id, payload) {
        const res = await request(
            "PUT",
            `/news/update/${encodeURIComponent(news_id)}`,
            payload);
        // success, data
        return res.data;
    },
    // 삭제하기
    async delete(news_id) {
        const res = await request(
            "DELETE",
            `/news/delete/${encodeURIComponent(news_id)}`
        );
        // 백엔드에서 보내는 http_response_code 번호 반환
        return res.status;
    },
}