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

// 에러 처리
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data ?? { error: "Network Error" };
    return Promise.reject({ status: err.response?.status, data });
  }
);

// 공통 request 헬퍼 -> 성공 시 data만 반환
export async function request(method, url, data) {
  // 요청, 응답 내용 res에 저장
  const res = await client.request({ method, url, data });

  // res에 저장된 내용 중 data만 뽑아서 반환
  return res.data;

}

export default client;