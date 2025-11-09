// 공통 요청 함수 (client.js에서 axios 인스턴스로 정의)
import { request } from './client'

// 학생 관련 API 요청 모아둔 객체
// 각 메서드는 백엔드의 RESTful API 엔드포인트를 호출
export const StudentsApi = {
  // 학생 목록 조회
  list(page = 1, limit = 2) {
    return request('GET', `/students?page=${page}&limit=${limit}`)
  },
  // 특정 학생 정보 조회
  get(id) {
    return request('GET', `/students/${id}`)
  },
  // 학생 등록
  create(payload) {
    return request('POST', `/students`, payload)
  },
  // 학생 정보 수정
  update(id, payload) {
    return request('PUT', `/students/${id}`, payload)
  },
  // 학생 삭제
  remove(id) {
    return request('DELETE', `/students/${id}`)
  },
}
