import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// 공용 인스턴스
export const publicInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

// 관리자 인스턴스 - 백엔드 미구현으로 주석처리
export const adminInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 관리자 인스턴스 전용 요청 인터셉터
adminInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token') // 관리자 토큰 별도 관리 가정
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 관리자 인스턴스 전용 응답 인터셉터 (401, 403 에러 처리)
adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: 토큰 만료 또는 인증 실패
    // 403: 권한 없음
    if (error.response && [401, 403].includes(error.response.status)) {
      // 1. 저장된 토큰 삭제
      localStorage.removeItem('admin_token')

      // 2. 로그인 페이지로 강제 이동
      alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)
