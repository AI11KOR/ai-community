// social login 전략 설정 
import passport from "passport";
import { Strategy as GitHubStartegy } from "passport-github2";
import prisma from "../lib/prisma";
import { generateTokens } from "../utils/jwtUtils";

passport.use(new GitHubStartegy({
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: 'http://localhost:8008/api/social/github/callback'
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            // 이미 가입된 유저인지 확인
            let user = await prisma.user.findFirst({
                where: { provider: 'github', providerId: profile.id }
            })

            // 없으면 자동 회원가입
            if(!user) {
                user = await prisma.user.create({
                    data: {
                        email: profile.emails?.[0]?.value || `github_${profile.id}@temp.com`,
                        name: profile.displayName || profile.username,
                        avatar: profile.photos?.[0]?.value,
                        provider: 'github',
                        providerId: profile.id
                    }
                })
            }

            //  우리 jWT 발급
            const tokens = generateTokens({ userId: user.id, email: user.email })

            // refreshToken DB 저장
            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: tokens.refreshToken }
            })

            return done(null, { ...tokens, name: user.name })
        } catch (error) {
            return done(error)
        }
    }
))

export default passport