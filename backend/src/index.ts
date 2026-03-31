import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import passport from './config/githubPassport';
import authRouter from './routes/authRouter';
import socialRouter from './routes/socialRouter';
import postRouter from './routes/postRouter';
import userRouter from './routes/userRouter';
import aiRouter from './routes/aiRouter';



const app = express()
const PORT = process.env.PORT || 8008  // .env에 PORT 없으면 4000 기본값

app.use(cors())
app.use(express.json())
app.use(passport.initialize()) // 초기화

app.use('/api/auth', authRouter)
app.use('/api/social', socialRouter)
app.use('/api/board', postRouter);
app.use('/api/user', userRouter);

app.use('/api/ai', aiRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`))
//          ↑ 하드코딩 8008 대신 변수 사용