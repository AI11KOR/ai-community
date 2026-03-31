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
    passport.authenticate('github', { session: false, failureRedirect: '/login' }), // 로그인 실패 시 이 경로로 이동
    (req, res) => {
        // passport가 인증 후 유저 정보를 req.user에 넣음 타입스크립트기에 as any로 타입체크 무시로 처리
        const user = req.user as any
        // 프론트로 토큰 전달
        res.redirect(`http://localhost:3003/auth/callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`)
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
        res.redirect(`http://localhost:3003/auth/callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`)
    }
)

export default router