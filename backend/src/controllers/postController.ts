import { Request, Response } from "express";
import prisma from "../lib/prisma";

// 게시글 목록 조회
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류' })
    }
}

// 게시글 상세 조회
export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                content: true,
                code: true,
                language: true,
                authorId: true,
                createdAt: true,
                updatedAt: true,
                // aiReview 제외! → 버튼 클릭 시 실시간으로 가져옴
                author: {
                    select: { id: true, name: true, avatar: true }
                },
                comments: {
                    include: {
                        author: {
                            select: { id: true, name: true, avatar: true }
                          }
                        }
                    }
                }
            })

            if(!post) {
                return res.status(400).json({ message: '게시글이 없습니다.' })
            }

            res.status(200).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 상세조회 에러:', error })
    }
}

// 게시글 작성
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, code, language } = req.body;

        if(!title || !content) {
            return res.status(400).json({ message: '제목과 내용을 입력해 주세요' })
        }

        const post = await prisma.post.create({
            data: {
              title,
              content,
              code,
              language,
              authorId: req.user!.userId
            }
          })

        res.status(200).json({ message: '게시글 작성 완료', post })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: '서버 오류 작성 에러:', error })
    }
}

// 게시글 수정
export const updatePost = async (req: Request, res: Response) => {
    try {
        const  { id } = req.params
        const { title, content, code, language } = req.body;

        // 본인 글인지 확인
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        })

        if(!post) {
            return res.status(404).json({ message: '게시글이 없습니다.' })
        }

        if(post.authorId !== req.user?.userId) {
            return res.status(403).json({ message: '본인 글만 수정할 수 있습니다.' })
        }

        const updated = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content, code, language }
        })

        res.status(200).json({ message: '수정 완료', updated })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 게시글 수정 에러:', error })
    }
}

// 게시글 삭제
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        // 본인 글이 맞는지 확인
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        })

        if(!post) {
            return res.status(404).json({ message: '게시글이 없습니다.' })
        }

        if(post.authorId !== req.user?.userId) {
            return res.status(403).json({ message: '본인 게시글만 삭제할 수 있어요' })
        }

        // 댓글 먼저 삭제 후 게시글 삭제
        await prisma.comment.deleteMany({
            where: { postId: Number(id)}
        })

        await prisma.post.delete({
            where: { id: Number(id) }
        })
        res.status(200).json({ message: '삭제 완료' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 삭제 에러:', error })
    }
}


// 댓글 작성
export const createComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if(!content) {
            return res.status(400).json({ message: '내용을 입력해주세요' })
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: Number(id),
                authorId: req.user!.userId
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        })

        res.status(201).json({ message: '댓글 작성 완료', comment })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 댓글 작성 에러:', error })
    }
}

// 댓글 목록 조회
export const getComments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const comments = await prisma.comment.findMany({
            where: { postId: Number(id) },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json(comments)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 목록 조회 에러:', error })
    }
}

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        })

        if(!comment) {
            return res.status(404).json({ message: '댓글이 없습니다.' })
        }

        if(comment.authorId !== req.user!.userId) {
            return res.status(401).json({ message: '본인 댓글만 수정할 수 있습니다.' })
        }

        const updated = await prisma.comment.update({
            where: { id: Number(commentId) },
            data: { content }
        })

        res.status(201).json({ message: '수정 완료', updated })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '댓글 수정 에러:', error })
    }
}

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        })

        if(!comment) {
            return res.status(404).json({ message: '댓글이 없습니다.' })
        }

        if(comment.authorId !== req.user!.userId) {
            return res.status(403).json({ message: '본인 댓글만 삭제 가능' })
        }

        // 실제 삭제 쿼리 DB에도 업데이트를 해야 함 실제로 프론트에서 삭제를 했는데 DB에도 업데이트를 하지 않으면 아무 소용이 없음
        await prisma.comment.delete({
            where: { id: Number(commentId) }
        })


        res.status(201).json({ message: '댓글 삭제 완료' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 삭제 에러:', error })
    }
}