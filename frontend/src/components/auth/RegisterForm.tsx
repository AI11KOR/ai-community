// 회원가입 폼 컴포넌트
// 이름, 이메일, 비밀번호 입력받아서 백엔드 회원가입 API 호출
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { RegisterRequest } from "@/types/auth"
import toast from "react-hot-toast"

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
    name: "",
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
      await api.post("/api/auth/register", form)
      toast.success("회원가입 완료! 로그인해주세요.")
      router.push("/login")

    } catch (err: any) {
      const message = err.response?.data?.message
      setError(message || "회원가입에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">이름</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름 입력"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />
      </div>

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
          placeholder="8자 이상"
          minLength={8}
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
        {loading ? "처리 중..." : "회원가입"}
      </button>
    </form>
  )
}