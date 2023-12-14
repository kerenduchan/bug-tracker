import express from 'express'
import {
    createBug,
    getBug,
    getBugs,
    removeBug,
    updateBug,
} from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.post('/', createBug)
router.put('/', updateBug)

export const bugRoutes = router
