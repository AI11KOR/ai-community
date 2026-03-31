'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'
import { Post } from '@/types/auth'

const heroSlides = [
    {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
        title: '개발자를 위한 AI 커뮤니티',
        sub: 'GPT-4와 RAG 기술로 더 스마트한 개발 환경을 경험하세요',
    },
    {
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
        title: 'AI 코드 리뷰',
        sub: '코드를 올리면 GPT-4가 즉시 리뷰해드립니다',
    },
    {
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
        title: '실시간 회의록 자동화',
        sub: 'Whisper STT로 음성을 텍스트로, GPT-4로 회의록을 자동 생성',
    },
    {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
        title: '개발자 커뮤니티',
        sub: '코드를 공유하고 함께 성장하는 플랫폼',
    },
    {
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
        title: '코드 유사도 탐지',
        sub: 'FAISS 벡터DB로 유사한 코드를 즉시 탐지합니다',
    },
]

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [current, setCurrent] = useState(0)
    const [zoomed, setZoomed] = useState(true)

    useEffect(() => {
        api.get<Post[]>('/api/board')
            .then(({ data }) => setPosts(data.slice(0, 3)))
            .catch(() => {})
    }, [])

    useEffect(() => {
        // 줌인 시작
        setZoomed(true)

        const timer = setInterval(() => {
            // 슬라이드 전환 시 줌 리셋 후 다시 줌인
            setZoomed(false)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % heroSlides.length)
                setZoomed(true)
            }, 100)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    const features = [
        {
            title: 'AI 코드 리뷰',
            desc: 'GPT-4와 RAG 기술로 코드를 분석합니다. 심각도, 개선 포인트, 보안 취약점을 자동으로 찾아드립니다.',
            badge: 'GPT-4 + RAG',
            href: '/board',
            color: '#3b82f6',
        },
        {
            title: '코드 유사도 탐지',
            desc: 'OpenAI 임베딩과 FAISS 벡터DB로 유사한 코드를 탐지합니다. 중복 코드를 사전에 방지하세요.',
            badge: 'FAISS + Embedding',
            href: '/board',
            color: '#6366f1',
        },
        {
            title: '실시간 회의록',
            desc: 'Whisper STT로 음성을 텍스트로 변환하고 GPT-4가 요약, 액션아이템, 회의 분석을 자동 생성합니다.',
            badge: 'Whisper + GPT-4',
            href: '/meeting',
            color: '#8b5cf6',
        },
    ]

    return (
        <div className="bg-white">

            {/* Hero 슬라이드 */}
            <section className="relative overflow-hidden" style={{ height: '480px' }}>
                {heroSlides.map((slide, idx) => (
                    <div
                        key={idx}
                        className="absolute inset-0 transition-opacity duration-1000"
                        style={{ opacity: current === idx ? 1 : 0 }}
                    >
                        {/* 줌인 이미지 */}
                        <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            style={{
                                transform: current === idx && zoomed ? 'scale(1.08)' : 'scale(1)',
                                transition: 'transform 5s ease-in-out',
                            }}
                        />
                        {/* 오버레이 */}
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%)' }}
                        />
                        {/* 텍스트 */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-5xl mx-auto px-6 w-full">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
                                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                                >
                                    AI-Powered Developer Community
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-3">{slide.title}</h1>
                                <p className="text-sm text-gray-200 mb-6 max-w-md">{slide.sub}</p>
                                <div className="flex gap-3">
                                    <Link
                                        href="/board"
                                        className="px-5 py-2 rounded-lg text-sm font-medium text-white transition"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                                    >
                                        게시판 바로가기
                                    </Link>
                                    <Link
                                        href="/meeting"
                                        className="px-5 py-2 rounded-lg text-sm font-medium transition"
                                        style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                                    >
                                        회의록 생성해보기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 슬라이드 인디케이터 */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: current === idx ? 20 : 6,
                                height: 6,
                                background: current === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* AI 기능 카드 */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">AI 핵심 기능</h2>
                    <p className="text-sm text-gray-400">최신 AI 기술을 활용한 3가지 핵심 기능을 제공합니다</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <Link key={f.title} href={f.href}>
                            <div
                                className="rounded-xl p-6 h-full transition hover:shadow-md cursor-pointer"
                                style={{ border: '1px solid #f0f0f0', background: '#fff' }}
                            >
                                <div
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4"
                                    style={{ background: `${f.color}15`, color: f.color }}
                                >
                                    {f.badge}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: f.color }}>
                                    <span>자세히 보기</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 최신 게시글 */}
            {posts.length > 0 && (
                <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                    <div className="max-w-5xl mx-auto px-6 py-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">최신 게시글</h2>
                                <p className="text-sm text-gray-400">개발자들이 공유한 최신 코드와 질문들</p>
                            </div>
                            <Link href="/board" className="text-xs text-blue-500 hover:text-blue-600 transition font-medium">
                                전체 보기 →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <Link key={post.id} href={`/board/${post.id}`}>
                                    <div
                                        className="bg-white rounded-xl p-5 transition hover:shadow-md cursor-pointer h-full"
                                        style={{ border: '1px solid #f0f0f0' }}
                                    >
                                        {post.language && (
                                            <span
                                                className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 font-medium"
                                                style={{ background: '#eff6ff', color: '#3b82f6' }}
                                            >
                                                {post.language}
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.content}</p>
                                        <div className="flex items-center justify-between mt-4 text-xs text-gray-300">
                                            <span>{post.author.name}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}