// ./client.js에서 request 함수 불러오기
import { request } from "./client.js";

// service API
export const ServiceApi = {
    // 전체 보기
    list() {
        return request("GET", "/service");
    },
    // 등록하기
    register(payload) {
        return request("POST", "/service/create", payload);
    },
    // 수정하기
    update(service_id, payload) {
        return request("PUT", `/service/update/${encodeURIComponent(service_id)}`, payload);
    },
    // 삭제하기
    delete(service_id) {
        return request("DELETE", `/service/delete/${encodeURIComponent(service_id)}`);
    },
}
