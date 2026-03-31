// 잘못된 url 접속할 경우 보여주는 404 페이지

import Link from 'next/link'

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: '#fafafa' }}
        >
            <div className="text-center px-6">

                {/* 404 숫자 */}
                <div
                    className="text-8xl font-bold mb-4"
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1
                    }}
                >
                    404
                </div>

                {/* 메시지 */}
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    페이지를 찾을 수 없습니다
                </h1>
                <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
                    요청하신 페이지가 존재하지 않거나 이동되었습니다.
                    URL을 다시 확인해주세요.
                </p>

                {/* 버튼 */}
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                    >
                        홈으로 가기
                    </Link>
                    <Link
                        href="/board"
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white transition hover:bg-gray-50"
                        style={{ border: '1px solid #e5e7eb' }}
                    >
                        게시판 보기
                    </Link>
                </div>

            </div>
        </div>
    )
}