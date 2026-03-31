// 로그인 폼 컴포넌트
// 이메일, 비밀번호 입력받아서 백엔드 로그인 API 호출
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { LoginRequest, LoginResponse } from "@/types/auth"

export default function LoginForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // input 변경시 form 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", form)

      // 토큰 로컬스토리지에 저장
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      // 전역 로그인 상태 업데이트
      setAuth(data.user)

      router.push("/board")

    } catch (err: any) {
      const message = err.response?.data?.message
      setError(message || "이메일 또는 비밀번호를 확인해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호 입력"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  )
}