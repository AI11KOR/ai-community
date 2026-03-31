// API 요청을 보낼 때 기본 설정을 잡아주는 파일
// 모든 API 호출은 이 api 객체를 통해서 함
import axios from "axios"

const api = axios.create({
  // 백엔드 주소 기본값 설정
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008",
})

// 요청 보내기 전에 실행됨
// localStorage에서 토큰 꺼내서 헤더에 자동으로 붙여줌
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// 응답 받은 후 실행됨
// 401 에러(토큰 만료)면 refreshToken으로 새 토큰 발급 후 원래 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 무한루프 방지

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) throw new Error("no refresh token")

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken }
        )

        // 새로 받은 토큰 저장
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // 실패했던 요청 다시 시도
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)

      } catch {
        // refresh도 실패하면 로그아웃 처리
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api