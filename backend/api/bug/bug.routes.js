import express from 'express'
import {
    createBug,
    getBug,
    getBugs,
    getBugCount,
    removeBug,
    updateBug,
} from './bug.controller.js'
import {
    authenticate,
    authorizeBugUpdateOrRemove,
} from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/count', getBugCount)
router.get('/:bugId', getBug)
router.delete('/:bugId', authorizeBugUpdateOrRemove, removeBug)
router.post('/', authenticate, createBug)
router.put('/:bugId', authorizeBugUpdateOrRemove, updateBug)

export const bugRoutes = router
