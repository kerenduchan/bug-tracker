import express from 'express'
import {
    createBug,
    getBug,
    getBugs,
    removeBug,
    updateBug,
} from './bug.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireAuth, removeBug)
router.post('/', requireAuth, createBug)
router.put('/', requireAuth, updateBug)

export const bugRoutes = router
