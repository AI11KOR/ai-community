import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: number,
    email: string
}

const ACCESS_EXPIRES = '1h'
const REFRESH_EXPIRES = '7d'

export const generateTokens = (payload: TokenPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXPIRES })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_EXPIRES })
    return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload
}