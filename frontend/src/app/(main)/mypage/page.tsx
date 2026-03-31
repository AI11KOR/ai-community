// 마이페이지
// 내정보 조회 + 수정 + 내가 쓴 게시글 목록

"use client"

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { MyPageResponse, Post } from "@/types/auth"
import Link from "next/link"
import toast from 'react-hot-toast';

const PAGE_SIZE = 5

export default function MyPage() {
    const router = useRouter();
    const { isLoggedIn, setAuth } = useAuthStore()

    const [userInfo, setUserInfo] = useState<MyPageResponse | null>(null);
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState('');
    const [page, setPage] = useState(1)

    useEffect(() => {
        if(!isLoggedIn) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [userRes, postRes] = await Promise.all([
                    api.get<MyPageResponse>('/api/user/me'),
                    api.get<Post[]>('/api/user/me/posts')
                ])
                setUserInfo(userRes.data)
                setPosts(postRes.data)
                setEditName(userRes.data.name)
            } catch (error) {
                console.error('마이페이지 불러오기 실패:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [isLoggedIn])

    const handleUpdate = async () => {
        try {
            const { data } = await api.patch("/api/user/me", { name: editName })
            setUserInfo((prev) => prev ? { ...prev, name: data.user.name } : prev)
            setAuth({ ...userInfo!, name: data.user.name })
            setEditMode(false)
            toast.success("수정 완료!")
        } catch (err: any) {
            toast.error(err.response?.data?.message || "수정 실패")
        }
    }

    const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
    const currentPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if(loading) return <p className="text-center py-10 text-sm text-gray-400">불러오는 중...</p>
    if (!userInfo) return null

    return (
        <div className='max-w-3xl mx-auto px-4 py-8 space-y-6' style={{ minHeight: 'calc(100vh - 56px - 200px)' }}>

            {/* 내 정보 */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h2 className='text-base font-bold mb-4'>내 정보</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-16">이름</span>
                        {editMode ? (
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        ) : (
                            <span>{userInfo.name}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-16">이메일</span>
                        <span>{userInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-16">가입일</span>
                        <span>{new Date(userInfo.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-16">로그인</span>
                        <span>{userInfo.provider}</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    {editMode ? (
                        <>
                            <button onClick={handleUpdate} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">저장</button>
                            <button onClick={() => setEditMode(false)} className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">취소</button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">수정</button>
                    )}
                </div>
            </div>

            {/* 내 게시글 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-base font-bold mb-4">내 게시글 ({posts.length})</h2>

                {/* 고정 높이 영역 */}
                <div style={{ minHeight: PAGE_SIZE * 56 }}>
                    {posts.length === 0 ? (
                        <p className="text-sm text-gray-400">작성한 게시글이 없습니다.</p>
                    ) : (
                        <div className="space-y-2">
                            {currentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/board/${post.id}`}
                                    className="block border-b border-gray-100 pb-2 hover:text-blue-500"
                                >
                                    <p className="text-sm">{post.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString("ko-KR")} · 댓글 {post._count?.comments ?? 0}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                        ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                        →
                    </button>
                </div>
            </div>

        </div>
    )
}