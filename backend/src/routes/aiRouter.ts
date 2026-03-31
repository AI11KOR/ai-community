import { Router } from 'express'
import { reviewCode, checkSimilarity, transcribeAudio } from '../controllers/aiController'
import { authMiddleware } from '../middleware/authMiddleware'
import multer from 'multer'

// multer: 파일 업로드 처리 미들웨어
// memoryStorage: 파일을 디스크 저장 없이 메모리에 올림
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

// 로그인한 유저만 AI 기능 사용 가능
router.post('/review', authMiddleware, reviewCode)
router.post('/similarity', authMiddleware, checkSimilarity)
router.post('/transcribe', authMiddleware, upload.single('audio'), transcribeAudio)

export default router