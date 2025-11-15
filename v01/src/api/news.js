// ./client.js에서 request 함수 불러오기
import { request } from './client';

// news API
export const NewsAPI = {
    // 전체 보기
    list() {
        return request("GET", "/news");
    },
    // 상세 보기
    detail(news_id) {
        return request("GET", `/news/${encodeURIComponent(news_id)}`);
    },
    // 작성하기
    create(payload) {
        return request("POST", "/news/create", payload);
    },
    // 수정하기
    update(news_id, payload) {
        return request("PUT", `/news/update/${encodeURIComponent(news_id)}`, payload);
    },
    // 삭제하기
    delete(news_id) {
        return request("DELETE", `/news/delete/${encodeURIComponent(news_id)}`);
    },
}