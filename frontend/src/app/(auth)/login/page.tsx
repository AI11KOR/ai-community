// 로그인 페이지
// LoginForm 컴포넌트 불러와서 보여줌
// 소셜 로그인 버튼도 여기서 처리
import Link from "next/link"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-1">AI 개발자 커뮤니티</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          로그인하고 AI 기능을 사용해보세요
        </p>

        <LoginForm />

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">또는</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <div className="space-y-2">
          <a
            href="http://localhost:8008/api/social/github"
            className="block w-full text-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
          >
            GitHub으로 로그인
          </a>
          <a
            href="http://localhost:8008/api/social/google"
            className="block w-full text-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
          >
            Google로 로그인
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          계정이 없으신가요?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>

      </div>
    </div>
  )
}