// Comment CRUDL API
import { utilService } from '../../services/util.service.js'
import { commentService } from './comment.service.js'

// List
export async function getComments(req, res) {
    try {
        const filterBy = _buildFilter(req.query)
        const { sortBy, sortDir, pageIdx, pageSize } = req.query
        const data = await commentService.query(
            filterBy,
            sortBy,
            utilService.toNumber(sortDir),
            utilService.toNumber(pageIdx),
            utilService.toNumber(pageSize)
        )
        res.send(data)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// count
export async function getCommentCount(req, res) {
    try {
        const filterBy = _buildFilter(req.query)
        const count = await commentService.count(filterBy)
        res.send({ count })
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// Get
export async function getComment(req, res) {
    const { commentId } = req.params

    try {
        const comment = await commentService.getById(commentId)
        res.send(comment)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Delete
export async function removeComment(req, res) {
    const { commentId } = req.params

    try {
        const result = await commentService.remove(commentId, req.loggedinUser)
        res.send(result)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Save
export async function createComment(req, res) {
    try {
        const savedComment = await commentService.create(
            req.body,
            req.loggedinUser
        )
        res.send(savedComment)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

export async function updateComment(req, res) {
    try {
        const savedComment = await commentService.update(
            req.body,
            req.loggedinUser
        )
        res.send(savedComment)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

function _buildFilter(query) {
    const { txt, creatorUsername, creatorId, bugId } = query

    const filter = {
        txt: txt === '' ? undefined : txt,
        creatorUsername: creatorUsername === '' ? undefined : creatorUsername,
        creatorId: creatorId === '' ? undefined : creatorId,
        bugId: bugId === '' ? undefined : bugId,
    }

    return utilService.removeNullAndUndefined(filter)
}
