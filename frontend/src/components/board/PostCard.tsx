// 게시글 목록에서 각 게시글을 카드 형태로 보여주는 컴포넌트
import Link from "next/link"
import { Post } from "@/types/auth"

export default function PostCard({ post }: { post: Post }) {
    return (
        <Link href={`/board/${post.id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">

                {/* 제목 */}
                <h2 className="text-base font-semibold mb-1">{post.title}</h2>

                {/* 내용 미리보기 */}
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.content}</p>

                {/* 언어 태그 */}
                {post.language && (
                    <span className="text-bold text-sm bg-gray-200 text-green-600 px-2 py-1 rounded mr-2">
                        {post.language}
                    </span>
                )}

                {/* 하단 정보 */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span>{post.author.name}</span>
                    <div className="flex items-center gap-3">
                        <span>댓글 {post._count?.comments ?? 0}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                </div>

            </div>
        </Link>
    )
}