// 게시글 내용 + 댓글 목록 
// 게시글 상세 페이지
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/axios"
import { Post, Comment } from "@/types/auth"
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast"


interface AiReview {
    language: string
    severity: 'danger' | 'warning' | 'good'
    severityReason: string
    review: string
    improvements: {
        point: string
        description: string
        hasCode: boolean
        improvedCode: string | null
    }[]
    isGoodCode: boolean
    praise: string | null
}

export default function PostDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuthStore()

    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState("")
    const [loading, setLoading] = useState(true)

    const [aiReview, setAiReview] = useState<AiReview | null>(null)
    const [reveiwLoading, setReviewLoading] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
        try {
            const { data } = await api.get<Post>(`/api/board/${id}`)
            setPost(data)
            setComments(data.comments ?? [])
        } catch (err) {
            console.error("게시글 불러오기 실패", err)
        } finally {
            setLoading(false)
        }
        }

        fetchPost()
    }, [id])

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!commentInput.trim()) return

        try {
            const { data } = await api.post(`/api/board/${id}/comments`, {
                content: commentInput
            })
            setComments((prev) => [...prev, data.comment])
            setCommentInput("")
        } catch (error: any) {
            toast.error(error.response?.data?.message || '댓글 작성 실패')
        }
    }


    // ai Review
    const handleAiReview = async () => {
        if(!post?.code) {
            toast.error('코드가 없는 게시글입니다.');
            return;
        }

        setReviewLoading(true)

        try {
            const { data } = await api.post('/api/ai/review', { code: post.code })
            console.log('AI review response:', JSON.stringify(data))
            setAiReview(data)  // data.review 아니고 data 그대로
        } catch (error: any) {
            toast.error('AI 리뷰 요청 실패')
        } finally {
            setReviewLoading(false)
        }
    }

    const handleDelete = async () => {
        if(!confirm('게시글을 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/api/board/${id}`)
            router.push('/board')
        } catch (error: any) {
            toast.error(error.response?.data?.message || '삭제 실패')
        }
    }

    // 댓글 수정
    const handleCommentUpdate = async (commentId: number) => {

        const newContent = prompt('수정할 내용을 입력해주세요');
        if(!newContent) return;

        try {
            const { data } = await api.patch(`/api/board/${id}/comments/${commentId}`, {
                content: newContent
            })

            // 수정한 댓글 목록에서 업데이트
            setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content: newContent } : c)) )
            
        } catch (error) {
            toast.success('댓글 수정 완료')
        }
    }

    // 댓글 삭제
    const handleCommentDelete = async (commentId: number) => {
        if(!confirm('댓글을 삭제하시겠어요?')) return;

        try {
            await api.delete(`/api/board/${id}/comments/${commentId}`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || '댓글 삭제 실패')
        }
    }

    if (loading) return <p className="text-center py-10 text-sm text-gray-400">불러오는 중...</p>
    if (!post) return <p className="text-center py-10 text-sm text-gray-400">게시글이 없습니다.</p>


    
    


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">

                <h1 className="text-xl font-bold mb-2">{post.title}</h1>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{post.author.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>

                {post.language && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {post.language}
                </span>
                )}

                <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">{post.content}</p>

                {post.code && (
                <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-md mt-4 overflow-x-auto">
                    {post.code}
                </pre>
                )}


                {/*  AI 코드 리뷰 section */}
                {post.code && (
                    <div className="mt-6">
                        <button
                            onClick={handleAiReview}
                            disabled={reveiwLoading}
                            className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-600 disabled:opacity-50"
                        >
                            {reveiwLoading ? ' AI 분석 중...' : 'AI 코드 리뷰'}
                        </button>

                        {aiReview && (
                            <div className="mt-4 border border-gray-200 rounded-lg p-4">

                                {/* 심각도 */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-bold">심각도:</span>
                                    {aiReview.severity === 'danger' && (
                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">🔴 위험</span>
                                    )}
                                    {aiReview.severity === 'warning' && (
                                        <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">🟡 개선필요</span>
                                    )}
                                    {aiReview.severity === 'good' && (
                                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">🟢 양호</span>
                                    )}
                                    <span className="text-xs text-gray-500">{aiReview.language}</span>
                                </div>

                                {/* 코드가 좋을 경우 칭찬 */}
                                {aiReview.isGoodCode && aiReview.praise && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                                        <p className="text-sm text-green-700">{aiReview.praise}</p>
                                    </div>
                                )}

                                {/* 전체 리뷰 */}
                                <div className="mb-3">
                                    <p className="text-sm font-bold mb-1">📝 리뷰</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {aiReview.review}
                                        {/* {typeof aiReview.review === 'string' ? aiReview.review : JSON.stringify(aiReview.review)} */}
                                    </p>
                                </div>

                                {/* 개선 포인트 */}
                                {aiReview.improvements && aiReview.improvements.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold mb-2">💡 개선 포인트</p>
                                    <div className="space-y-3">
                                        {aiReview.improvements.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 rounded-md p-3">
                                                <p className="text-sm font-medium text-gray-800">{item.point}</p>
                                                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                                {item.hasCode && item.improvedCode && (
                                                    <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded mt-2 overflow-x-auto">
                                                        {item.improvedCode}
                                                    </pre>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            </div>
                        )}
                    </div>    
                )}


                {user?.id === post.authorId && (
                <div className="flex gap-2 mt-4">
                    <button
                    onClick={() => router.push(`/board/${id}/edit`)}
                    className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                    >
                    수정
                    </button>
                    <button
                    onClick={handleDelete}
                    className="text-xs border border-red-300 text-red-500 px-3 py-1 rounded hover:bg-red-50"
                    >
                    삭제
                    </button>
                </div>
                )}

            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-bold mb-4">댓글 {comments.length}개</h2>

                {/* 댓글 목록 */}
                <div className="space-y-3 mb-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-betwen text-xs text-gray-400 mb-1">
                                <span>{comment.author.name}</span>
                                <div className="flex items-center gap-2">
                                    <span>{new Date(comment.createdAt).toLocaleDateString("ko-KR")}</span>
                                    {/* 본인 댓글이면 수정 및 삭제 버튼 표시 */}
                                    {user?.id === comment.authorId && (
                                        <>
                                            <button
                                                onClick={() => handleCommentUpdate(comment.id)}
                                                className="text-blue-400 hover:text-blue-600 text-xs"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleCommentDelete(comment.id)}
                                                className="text-red-400 hover:text-red-600 text-xs"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* 댓글 내용 */}
                            <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    작성
                </button>
                </form>

            </div>

            <button
                onClick={() => router.push("/board")}
                className="mt-4 text-sm text-gray-400 hover:underline"
            >
                목록으로
            </button>

        </div>
    )
}