"use client"

import { useEffect } from "react"
import api from "@/lib/axios"
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";

export default function SocailCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { setAuth } = useAuthStore()

    useEffect(() => {
        const handleCallback = async () => {
            const accessToken = searchParams.get('accessToken')
            const refreshToken = searchParams.get('refreshToken')

            if(!accessToken || !refreshToken) {
                router.replace('/login?error=social_failed')
                return;
            }


            // token 먼저 저장
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)


            try {
                // user 정보
                const res = await api.get('/api/user/me')
                const user = res.data // { id, email, name, avatar ... }

                // zustand store update
                setAuth(user)

                // main으로 이동
                router.replace('/')

            } catch (error: any) {
                // user 정보 실패시 저장한 토큰을 정리
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                router.replace('/login?error=social_failed')
            }
        }

        handleCallback()
    }, [])

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">로그인 처리 중...</p>
                </div>
            </div>
        )
}