import { loggerService } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'
import { bugService } from '../api/bug/bug.service.js'
import { commentService } from '../api/comment/comment.service.js'

export function authenticate(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })
    req.loggedinUser = loggedinUser
    next()
}

export function authenticateAdmin(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })

    if (!loggedinUser.isAdmin) {
        loggerService.warn(
            `${loggedinUser.username} tried to perform admin action`
        )
        return res.status(403).send({ error: 'Not authorized' })
    }
    req.loggedinUser = loggedinUser
    next()
}

export function authenticateAdminOrSelf(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })

    if (!loggedinUser.isAdmin && loggedinUser._id !== req.params.userId) {
        loggerService.warn(
            `${loggedinUser.username} tried to perform admin action`
        )
        return res.status(403).send({ error: 'Not authorized' })
    }
    req.loggedinUser = loggedinUser
    next()
}

// only an admin can set/update a user's isAdmin or score
export function authorizeCreateOrUpdateUser(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })

    if (
        !loggedinUser.isAdmin &&
        (req.body.isAdmin === true || req.body.score !== undefined)
    ) {
        loggerService.warn(
            `${loggedinUser.username} tried to perform admin action`
        )
        return res.status(403).send({ error: 'Not authorized' })
    }
    req.loggedinUser = loggedinUser
    next()
}

// only an admin or the bug creator can delete/update a bug
export async function authorizeBugUpdateOrRemove(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })

    try {
        const bug = await bugService.getById(req.params.bugId)
        if (
            !loggedinUser.isAdmin &&
            loggedinUser._id !== bug.creatorId.toString()
        ) {
            loggerService.warn(
                `${loggedinUser.username} tried to perform admin action`
            )
            return res.status(403).send({ error: 'Not authorized' })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }

    req.loggedinUser = loggedinUser
    next()
}

// only an admin or the comment creator can delete/update a comment
export async function authorizeCommentUpdateOrRemove(req, res, next) {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send({ error: 'Not logged in' })

    try {
        const comment = await commentService.getById(req.params.commentId)
        if (
            !loggedinUser.isAdmin &&
            loggedinUser._id !== comment.creatorId?.toString()
        ) {
            loggerService.warn(
                `${loggedinUser.username} tried to perform admin action`
            )
            return res.status(403).send({ error: 'Not authorized' })
        }
    } catch (err) {
        return res.status(400).send({ error: err })
    }

    req.loggedinUser = loggedinUser
    next()
}
