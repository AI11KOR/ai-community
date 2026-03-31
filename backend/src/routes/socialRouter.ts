import passport from "passport";
import '../config/githubPassport';
import '../config/googlePassport';
import { Router } from "express";
const router = Router();

// github login 시작
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'], // github한테 해당 사용자의 이메일 정보를 요청
    session: false // 로그인 정보를 세션에 저장을 하는게 기본 원칙이나, JWT를 사용하므로 세션 불필요 jwt 방식에서는 반드시 false라고 해야 에러 안남
}))

// github callback
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const user = req.user as any
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003'
        res.redirect(`${frontendUrl}/auth/callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`)
    }
)

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}))

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login'}),
    (req, res) => {
        const user = req.user as any
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003'
        res.redirect(`${frontendUrl}/auth/callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`)
    }
)

export default router