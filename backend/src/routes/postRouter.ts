import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, createComment,
    getComments, updateComment, deleteComment 
        } from '../controllers/postController'

import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authMiddleware, createPost)
router.patch('/:id', authMiddleware, updatePost)
router.delete('/:id', authMiddleware, deletePost)

router.post('/:id/comments', authMiddleware, createComment)
router.get('/:id/comments', getComments)
router.patch('/:id/comments/:commentId', authMiddleware, updateComment)
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment)


export default router;