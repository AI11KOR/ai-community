// 게시글 수정 페이지
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/axios"
import { Post, CreatePostRequest } from "@/types/auth"
import toast from "react-hot-toast"

export default function EditPage() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState<CreatePostRequest>({
    title: "",
    content: "",
    code: "",
    language: "",
  })
  const [loading, setLoading] = useState(true)

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get<Post>(`/api/board/${id}`)
        setForm({
          title: data.title,
          content: data.content,
          code: data.code ?? "",
          language: data.language ?? "",
        })
      } catch (err) {
        console.error("게시글 불러오기 실패", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch(`/api/board/${id}`, form)
      router.push(`/board/${id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "수정 실패")
    }
  }

  if (loading) return <p className="text-center py-10 text-sm text-gray-400">불러오는 중...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">게시글 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">언어 (선택)</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">언어 선택</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">코드 (선택)</label>
          <textarea
            name="code"
            value={form.code}
            onChange={handleChange}
            rows={8}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  )
}
