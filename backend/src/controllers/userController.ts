import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const myPage = async (req: Request, res: Response) => {
    try {
        const userPage = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                provider: true,
                createdAt: true
            }
        })

        res.status(200).json(userPage)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 마이페이지 에러:', error })
    }
}

// 내 정보 수정
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, avatar } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user!.userId },
            data: { name, avatar },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
            }
        })

        res.status(201).json({ message: '수정 완료', user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 정보수정 에러:', error })
    }
}

// 내 게시글 목록
export const getMyPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: req.user!.userId },
            include: {
                _count: { select: { comments: true }}
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 게시글 목록 조회 실패:', error })
    }
}