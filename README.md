프로젝트 개요

소개
AI 기술을 활용한 개발자 커뮤니티 플랫폼 GPT-4 기반 코드 리뷰, FAISS 코드 유사도 탐지,
Whisper STT 회의록 자동 생성 기능을 제공
배포 주소: https://baepo.shop
GitHub 주소: https://github.com/AI11KOR/ai-community.git

기술 스텍
 - Frontend: Next.js + Typescript + Tailwind CSS
 - Backend: Node.js + Express + Typescript + Prisma ORM
 - AI server: Python + Flask + LangChain + FAISS
 - Database: PostgreSQL
 - Auth: JWT + GitHub OAuth + Google OAuth
 - AI: GPT-4o-mini, Whisper STT, OpenAI Embeddings, FAISS
 - Infra: AWS Lightsail + Docker + Nginx + Lets Encrypt

주요 기능
 - 게시판 CRUD + 댓글 시스템
 - AI 코드 리뷰(GPT-4 + RAG + LangChain + FAISS)
 - 코드 유사도 탐지(OpenAI Embeddings + FAISS)
 - 실시간 회의록 생성(Whisper STT + GPT-4 요약)
 - 회의록 PDF 다운로드
 - 소셜 로그인(GitHub, Google OAuth)
 - JWT 인증 + Refresh Token

서버 포트 구성
frontend: 3003
backend: 8008
aiserver: 5005
Nginx: 80(http) / 443(https)
PostgreSQL: 5432

로컬 실행방법
# 백엔드 
cd backend && npm install && npm run dev

# 프론트엔드
cd frontend && npm install && npm run dev

# Ai 서버
cd ai && pip install -r requirements.txt && python app.py

배포 전 테스트
- AWS Lightsail 인스턴스 생성(우분투)
- 방화벽 포트 오픈: 22, 80, 443
- 도메인 구매 및 DNS A 레코드 설정
- Docker Hub 계정 생성
- GitHub/Google OAuth 앱 생성
- OpenAI API 키 발급

