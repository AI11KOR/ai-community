// 게시판 메인 페이지
// 백엔드에서 게시글 목록 불러와서 PostCard로 보여줌
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import PostCard from "@/components/board/PostCard"
import { Post } from "@/types/auth"

const PAGE_SIZE = 5; // 페이지당 게시글 수

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // 페이지 로드시 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get<Post[]>("/api/board")
        setPosts(data)
      } catch (err) {
        console.error("게시글 목록 불러오기 실패", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // 현재 페이지 게시글
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const currentPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" style={{ minHeight: 'calc(100vh - 56px - 200px)' }}>

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">게시판</h1>
        <Link
          href="/board/write"
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
        >
          글쓰기
        </Link>
      </div>

          {/* 게시글 목록 */}
          {loading ? (
          <p className="text-sm text-gray-400">불러오는 중...</p>
            ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400">게시글이 없습니다.</p>
            ) : (
              <>
              {/* 게시글 목록 - 고정 높이 영역 */}
                <div style={{ minHeight: PAGE_SIZE * 100 }}>
                  <div className="space-y-3">
                    {currentPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>

              {/* 페이지네이션 */}
          <div className="flex items-center justify-center gap-1 mt-8">
            <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
                이전
            </button>

        {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
                key={p}
                onClick={() => setPage(p)}
                className="px-3 py-1.5 rounded-md text-sm transition"
                style={{
                    background: page === p ? '#3b82f6' : 'transparent',
                    color: page === p ? '#fff' : '#6b7280',
                    fontWeight: page === p ? 600 : 400,
                }}
            >
                {p}
            </button>
        ))}

        <button
            onClick={() => setPage((p) => Math.min(Math.max(1, totalPages), p + 1))}
            disabled={page === Math.max(1, totalPages)}
            className="px-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
            다음
        </button>
    </div>
                </>
            )}
        </div>
    )
}