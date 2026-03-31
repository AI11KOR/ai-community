import { Router } from 'express'
import { myPage, updateUser, getMyPosts } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.get('/me', authMiddleware, myPage)
router.patch('/me', authMiddleware, updateUser)
router.get('/me/posts', authMiddleware, getMyPosts)

export default router