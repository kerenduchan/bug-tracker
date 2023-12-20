// User CRUDL API
import { utilService } from '../../services/util.service.js'
import { userService } from './user.service.js'

// List
export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minScore: +req.query.minScore || 0,
        }
        const users = await userService.query(
            filterBy,
            req.query.sortBy,
            utilService.toNumber(req.query.sortDir),
            utilService.toNumber(req.query.pageIdx),
            utilService.toNumber(req.query.pageSize)
        )
        res.send(users)
    } catch (err) {
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
        res.status(400).send({ error: err })
    }
}

// // Save
export async function createUser(req, res) {
    try {
        const savedUser = await userService.create(req.body)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

export async function updateUser(req, res) {
    try {
        const savedUser = await userService.update(req.body)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}
