import express from 'express'
import {
    getComments,
    getComment,
    createComment,
    removeComment,
    updateComment,
} from './comment.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getComments)
router.get('/:commentId', getComment)
router.delete('/:commentId', requireAuth, removeComment)
router.post('/', requireAuth, createComment)
router.put('/', requireAuth, updateComment)

export const commentRoutes = router
