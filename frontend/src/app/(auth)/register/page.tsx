import Link from "next/link"
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">

                <h1 className="text-xl font-bold text-center mb-1">회원가입</h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    AI 개발자 커뮤니티에 오신 걸 환영합니다
                </p>

                <RegisterForm />

                <p className="text-center text-sm text-gray-500 mt-5">
                    이미 계정이 있으신가요?{" "}
                    <Link href='/login' className="text-blue-500 hover:underline">
                        로그인
                    </Link>
                </p>
                
            </div>
        </div>
    )
}