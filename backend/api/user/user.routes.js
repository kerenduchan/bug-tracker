import express from 'express'
import {
    createUser,
    getUser,
    getUsers,
    removeUser,
    updateUser,
} from './user.controller.js'
import {
    requireAdmin,
    requireAdminOrSelf,
} from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', requireAdmin, getUsers)
router.get('/:userId', requireAdminOrSelf, getUser)
router.delete('/:userId', requireAdmin, removeUser)
router.post('/', requireAdmin, createUser)
router.put('/', requireAdmin, updateUser)

export const userRoutes = router
