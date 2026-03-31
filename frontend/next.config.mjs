/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ← 이거 추가
    },
    typescript: {
      ignoreBuildErrors: true, // ← 이거도 추가
    },
  }
  
  export default nextConfig