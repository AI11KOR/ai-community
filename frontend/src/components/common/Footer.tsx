export default function Footer() {
    const services = [
        { href: '/board', label: '게시판' },
        { href: '/meeting', label: '회의방' },
        { href: '/mypage', label: '마이페이지' },
    ]

    const techStack = [
        'Next.js 14',
        'Node.js + Express',
        'Python + Flask',
        'PostgreSQL + Prisma',
        'OpenAI API',
    ]

    const aiBadges = ['GPT-4', 'RAG', 'FAISS', 'Whisper']

    return (
        <footer className="bg-white mt-auto" style={{ borderTop: '1px solid #f0f0f0' }}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* 브랜드 */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                            >
                                AI
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-sm text-gray-900">DevAI</span>
                                <span className="text-gray-400" style={{ fontSize: '10px' }}>Community</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                            AI 기술로 개발자 커뮤니티를 더 스마트하게.
                            GPT-4와 RAG 기반의 코드 리뷰, 유사도 탐지,
                            Whisper 기반 회의록 자동화를 제공합니다.
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {aiBadges.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs px-2 py-0.5 rounded-full text-blue-600"
                                    style={{ background: '#eff6ff', fontSize: '10px' }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">서비스</p>
                        <ul className="space-y-2">
                            {services.map(({ href, label }) => (
                                <li key={href}>
                                    <a href={href} className="text-xs text-gray-400 hover:text-gray-700 transition">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 기술 스택 */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Tech Stack</p>
                        <ul className="space-y-2">
                            {techStack.map((tech) => (
                                <li key={tech} className="text-xs text-gray-400">{tech}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* 하단 바 */}
            <div style={{ borderTop: '1px solid #f5f5f5', background: '#fafafa' }}>
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">© 2026 DevAI Community. All rights reserved.</p>
                    <p className="text-xs text-gray-300">Powered by OpenAI · LangChain · FAISS</p>
                </div>
            </div>

        </footer>
    )
}