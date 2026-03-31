import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import prisma from "../lib/prisma";
import { generateTokens, verifyRefreshToken } from "../utils/jwtUtils";

// 회원가입
export const register = async (req: Request, res: Response) => {

    try {
        const { email, password, name } = req.body;
        if(!email || !password || !name) {
            return res.status(400).json({ message: '내용을 입력해 주세요' })
        }

        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if(existing) {
            return res.status(400).json({ message: '이미 사용중인 이메일입니다.' })
        }

        // 비밀번호 암호화
        const hashed = await bcrypt.hash(password, 10)

        // DB 저장
        const user = await prisma.user.create({
            data: { email, password: hashed, name }
        })

        res.status(200).json({ message: '회원가입 완료', userId: user.id })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}

// 로그인
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {

        // 유저 찾기
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user || !user.password) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' })
        }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' })
        }

        const { accessToken, refreshToken } = generateTokens({ userId: user.id, email: user.email })

        // refresh Toekn DB 저장
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        })

        res.json({ message: '로그인 성공', accessToken, refreshToken, 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                provider: user.provider,
                createdAt: user.createdAt
              }
        })
  } catch (error) {
    res.status(500).json({ message: '서버 오류' })
  }
}

// access Token 재발급
export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) {
            return res.status(401).json({ message: 'RefreshToken 이 없습니다.' })
        }

        // 토큰 검증
        const payload = verifyRefreshToken(refreshToken)

        // DB에 저장된 refresh Token과 비교
        const user = await prisma.user.findUnique({
            where: {id: payload.userId }
        })
        if(!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: '유효하지 않은 Refresh Token이에요' })
        }

        // 새 accessToekn 발급
        const tokens = generateTokens({ userId: user.id, email: user.email })
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken }
        })

        res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: '토큰이 만료되었거나 유효하지 않습니다.' })
    }
}

// 로그아웃
export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) {
            return res.status(400).json({ message: 'Refresh Token이 없어요' })
        }

        const payload = verifyRefreshToken(refreshToken);

        // DB에서 refresh Token 삭제
        await prisma.user.update({
            where: { id: payload.userId },
            data: { refreshToken: null }
        });

        res.status(201).json({ message: '로그아웃 완료' })
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' })
    }
}

// 내 정보 조회
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: { id: true, email: true, name: true, avatar: true, createdAt: true }
          })
          
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 정보 불러오기 에러:', error })
    }
}