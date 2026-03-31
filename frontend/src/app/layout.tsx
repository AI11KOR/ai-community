// 모든 페이지의 공통 레이아웃
// 여기 있는 html, body 태그가 전체 페이지 감싸줌
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: "AI 개발자 커뮤니티",
  description: "AI 기능이 탑재된 개발자 커뮤니티 플랫폼",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        {children}
        {/* 토스트 알림 전역 설정 */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            success: {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
              },
            },
          }}
        />
      </body>
    </html>
  )
}