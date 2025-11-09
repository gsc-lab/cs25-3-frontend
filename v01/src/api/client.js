// axios HTTP 클라이언트 라이브러리 불러오기
import axios from 'axios'

// 프론트에서는 항상 '/api'만 호출
const BASE_URL = '/api'  // 모든 요청의 기본 경로를 '/api'로 고정한다.

// 공통 설정이 적용된 axios 인스턴스를 생성한다.
export const api = axios.create({
  baseURL: BASE_URL,  // 인스턴스의 기본 URL을 '/api'로 설정
  headers: { 'Content-Type': 'application/json' },  // 기본 요청 헤더를 JSON으로 지정
  timeout: 10000,  // 10초 안에 응답이 없으면 요청 중단
})

// // 응답 인터셉터: 실패 시 에러 객체에 status/body를 담아서 throw
// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     const r = error?.response
//     const err = new Error(`[API] ${r?.config?.method?.toUpperCase()} ${r?.config?.url} ${r?.status}`)
//     err.status = r?.status
//     err.body = r?.data ?? r?.statusText ?? null  // ← 서버의 유효성 오류 JSON 그대로
//     console.error('[API ERROR]', err.message, err.body)
//     throw err
//   }
// )

// 공통 request 헬퍼 (성공 시 data만 반환)
export async function request(method, url, data) {
  // axios 인스턴스로 실제 요청을 보냄
  const res = await api.request({ method, url, data })
  return res.data   // 호출부가 바로 사용할 수 있도록 data만 뽑아 반환
}
