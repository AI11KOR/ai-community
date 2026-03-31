// 게시글 작성 페이지
// 제목, 내용, 코드, 언어 입력받아서 백엔드에 저장
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CreatePostRequest } from '@/types/auth';

export default function Writepage() {
    const router = useRouter()

    const [form, setForm] = useState<CreatePostRequest>({
        title: '',
        content: '',
        code: '',
        language: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');


    // input, textarea 변경시 form 상태 업데이트
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')


        try {
          // 코드가 있으면 유사도 먼저 체크
          if(form.code) {
            const { data } = await api.post('/api/ai/similarity', { code: form.code })
            const highSimilarity = data.results.filter((r: any) => r.similarity >= 80)

            if(highSimilarity.length > 0) {
              const confirmed = confirm(
                `유사도 ${highSimilarity[0].similarity}%인 코드가 있습니다.\n그래도 등록하시겠습니까?`
              )
              if(!confirmed) {
                setLoading(false)
                return
              }
            }

          }


            await api.post("/api/board", form)
            router.push('/board')
        } catch (error: any) {
            const message = error.response?.data?.message
            setError(message || '게시글 작성에 실패하였습니다.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
    
          <h1 className="text-xl font-bold mb-6">게시글 작성</h1>
    
          <form onSubmit={handleSubmit} className="space-y-4">
    
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
    
            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium mb-1">내용</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
    
            {/* 언어 선택 */}
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
    
            {/* 코드 */}
            <div>
              <label className="block text-sm font-medium mb-1">코드 (선택)</label>
              <textarea
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="공유할 코드를 입력하세요"
                rows={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
    
            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}
    
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
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "저장 중..." : "작성 완료"}
              </button>
            </div>
    
          </form>
        </div>
      )
}