import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import User from '../../db/model/User.js'
import Bug from '../../db/model/Bug.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    create,
    update,
}

// user fields that can be set/updated
const FIELDS = ['username', 'fullname', 'score', 'password', 'isAdmin']

async function query(
    filterBy,
    sortBy,
    sortDir = 1,
    pageIdx = undefined,
    pageSize = 5
) {
    const criteria = _buildCriteria(filterBy)
    const totalCount = await User.countDocuments(criteria)

    let queryChain = User.find(criteria)

    if (sortBy) {
        queryChain = queryChain.sort({ [sortBy]: sortDir })
    }

    if (pageIdx !== undefined) {
        const startIdx = pageIdx * pageSize
        queryChain = queryChain.skip(startIdx).limit(pageSize)
    }

    try {
        let users = await queryChain.exec()
        users = users.map((user) => _toObject(user))
        return { data: users, totalCount }
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const dbUser = await User.findById(userId).exec()
        if (!dbUser) {
            throw `User not found`
        }
        return _toObject(dbUser)
    } catch (err) {
        _handleError(err)
    }
}

async function getByUsername(username) {
    try {
        const dbUser = await User.findOne({ username }).exec()
        if (!dbUser) {
            throw `User not found`
        }
        return _toObject(dbUser, false)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    try {
        // don't allow removing a user that has bugs
        const bugsCount = await Bug.countDocuments({ creator: userId })

        if (bugsCount > 0) {
            throw `User cannot be removed. ${bugsCount} bug(s) are associated with the user.`
        }
        const { deletedCount } = await User.deleteOne({ _id: userId })
        return { deletedCount }
    } catch (err) {
        _handleError(err)
    }
}

async function create(user) {
    if (typeof user.password !== 'string') {
        throw 'password must be a string'
    }

    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)

    try {
        const dbUser = await User.create(user)
        return _toObject(dbUser)
    } catch (err) {
        _handleError(err)
    }
}

async function update(userId, user) {
    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)

    if (user.password !== undefined && typeof user.password !== 'string') {
        throw 'password must be a string'
    }

    const options = { new: true, runValidators: true }
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            user,
            options
        ).exec()
        return _toObject(updatedUser)
    } catch (err) {
        _handleError(err)
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.minScore) {
        criteria.score = { $gte: filterBy.minScore }
    }
    if (filterBy.txt && filterBy.txt.length > 0) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ]
    }
    return criteria
}

// return the user as an object, excluding the password and version fields, and
// including the virtual createdAt field
function _toObject(dbUser, deletePassword = true) {
    const obj = dbUser.toObject({
        virtuals: true,
        versionKey: false,
    })

    if (deletePassword) delete obj.password
    delete obj.id
    return obj
}

// don't expose the DB - formulate our own error messages
function _handleError(err) {
    if (err.code === 11000 && err.keyPattern.username) {
        throw `Username already taken`
    }

    utilService.handleDbError(err)
}
