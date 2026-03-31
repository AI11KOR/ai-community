// (main) 그룹 레이아웃
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}