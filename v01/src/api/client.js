// HTTP 요청을 쉽게 처리해 주는 axios 클라이언트 라이브러리 불러오기
import axios from 'axios'

// 모든 요청의 기본 경로를 '/v1'로 고정
const BASE_URL = '/v1';

// axios 인스턴스 생성 (공통 설정 적용)
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content_Type': 'application/json' }
})

// 에러 원본 그대로 던지기
client.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

// 공통 request 헬퍼 -> 성공 시 data만 반환
export async function request(method, url, data) {
  const config = {
    method,
    url,
  };

  // FormData면 그대로 보냄 (Content-Type 자동)
  if (data instanceof FormData) {
    config.data = data;
  } else if (data !== undefined) {
    // JSON 보낼 때만 Content-Type 지정
    config.data = data;
    config.headers = { "Content-Type": "application/json" };
  }
  // 요청 및 응답
  const res = await client.request(config);

  return res;  // 응답: data + status + headers
}

export default client;