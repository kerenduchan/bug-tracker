// User CRUDL API
import { utilService } from '../../services/util.service.js'
import { userService } from './user.service.js'

// List
export async function getUsers(req, res) {
    try {
        const filterBy = _buildFilter(req.query)
        const { sortBy, sortDir, pageIdx, pageSize } = req.query

        const users = await userService.query(
            filterBy,
            sortBy,
            utilService.toNumber(sortDir),
            utilService.toNumber(pageIdx),
            utilService.toNumber(pageSize)
        )
        res.send(users)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// Get
export async function getUser(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Delete
export async function removeUser(req, res) {
    const { userId } = req.params

    try {
        // don't allow removing the logged in user
        if (userId === req.loggedinUser._id) {
            throw 'Cannot delete the logged in user'
        }
        const result = await userService.remove(userId)
        res.send(result)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Save
export async function createUser(req, res) {
    try {
        const savedUser = await userService.create(req.body)
        res.send(savedUser)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

export async function updateUser(req, res) {
    try {
        const savedUser = await userService.update(req.body)
        res.send(savedUser)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

function _buildFilter(query) {
    const { txt, minScore } = query
    const filterBy = {
        txt: txt === '' ? undefined : txt,
        minScore: utilService.toNumber(minScore),
    }

    return utilService.removeNullAndUndefined(filterBy)
}
