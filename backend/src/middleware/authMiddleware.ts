import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";

declare module 'express-serve-static-core' {
    interface Request {
        user?: { userId: number, email: string }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization


    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: '토큰이 없습니다.' })
        return
    }

    try {
        const token = authHeader.split(' ')[1]
        req.user = verifyAccessToken(token)
        next()
    } catch (error) {
        res.status(401).json({ message: '토큰이 만료되었거나 유효하지 않습니다.:', error })
    }
}