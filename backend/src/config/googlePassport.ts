import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from "../lib/prisma";
import { generateTokens } from "../utils/jwtUtils";


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8008/api/social/google/callback'
},
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            // 이미 가입된 유저 확인
            let user = await prisma.user.findFirst({
                where: { provider: 'google', providerId: profile.id }
            })

            // 없으면 자동 회원가입
            if(!user) {
                user = await prisma.user.create({
                    data: {
                        email: profile.emails?.[0].value || `google_${profile.id}@temp.com`,
                        name: profile.displayName || profile.username,
                        avatar: profile.photos?.[0]?.value,
                        provider: 'google',
                        providerId: profile.id
                    }
                })
            }

            // jwt 발급
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