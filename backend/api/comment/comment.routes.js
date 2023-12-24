import express from 'express'
import {
    getComments,
    getComment,
    createComment,
    removeComment,
    updateComment,
} from './comment.controller.js'
import {
    authenticate,
    authorizeCommentUpdateOrRemove,
} from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getComments)
router.get('/:commentId', getComment)
router.delete('/:commentId', authorizeCommentUpdateOrRemove, removeComment)
router.post('/', authenticate, createComment)
router.put('/:commentId', authorizeCommentUpdateOrRemove, updateComment)

export const commentRoutes = router
