'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isLoggedIn, clearAuth } = useAuthStore()

    const handleLogout = () => {
        clearAuth()
        router.push('/login')
    }

    const navLinks = [
        { href: '/board', label: '게시판' },
        { href: '/meeting', label: '회의방' },
    ]

    return (
        <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* 로고 */}
                <Link href='/' className="flex items-center gap-2.5 group">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                    >
                        AI
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-sm text-gray-900">DevAI</span>
                        <span className="text-xs text-gray-400" style={{ fontSize: '10px' }}>Community</span>
                    </div>
                </Link>

                {/* 네비게이션 */}
                <nav className="flex items-center gap-1">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-150
                                ${pathname?.startsWith(href)
                                    ? 'text-blue-600 font-medium bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* 유저 영역 */}
                <div className="flex items-center gap-2 text-sm">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href='/mypage'
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                                >
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-gray-700 text-xs font-medium">{user?.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition border border-gray-100"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href='/login'
                                className="px-4 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                            >
                                로그인
                            </Link>
                            <Link
                                href='/register'
                                className="px-4 py-1.5 rounded-lg text-sm text-white transition"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </header>
    )
}