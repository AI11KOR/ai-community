// 로그인 상태를 전역으로 관리하는 파일
// 어느 컴포넌트에서든 useAuthStore() 로 로그인 정보 꺼내 쓸 수 있음
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types/auth"

interface AuthState {
    user: User | null
    isLoggedIn: boolean
    setAuth: (user: User) => void // 로그인 성공 시 호출
    clearAuth: () => void // 로그아웃시 호출
}

export const useAuthStore = create<AuthState>()(
    // persist: 새로고침해도 로그인 상태 유지 (localStorage에 저장)
    persist(
        (set) => ({
        user: null,
        isLoggedIn: false,

        setAuth: (user) => set({ user, isLoggedIn: true }),

        clearAuth: () => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            set({ user: null, isLoggedIn: false })
        },
        }),
        { name: "auth-storage" }
    )
)