import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import User from '../../db/model/User.js'
import Bug from '../../db/model/Bug.js'
import Comment from '../../db/model/Comment.js'

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

    // lookup, project, and filter
    const pipeline = [
        {
            $match: criteria,
        },
        {
            $lookup: {
                from: 'bugs',
                localField: '_id',
                foreignField: 'creatorId',
                as: 'bugs',
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'creatorId',
                as: 'comments',
            },
        },
        {
            $project: {
                _id: 1,
                username: 1,
                fullname: 1,
                isAdmin: 1,
                score: 1,
                createdAt: 1,
                bugCount: { $size: '$bugs' },
                commentCount: { $size: '$comments' },
            },
        },
    ]

    // sort
    if (sortBy) {
        pipeline.push({ $sort: { [sortBy]: sortDir } })
    }

    // pagination
    if (pageIdx !== undefined) {
        const startIdx = pageIdx * pageSize
        pipeline.push({ $skip: startIdx }, { $limit: pageSize })
    }

    try {
        const users = await User.aggregate(pipeline).exec()
        return { data: users, totalCount }
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const dbUser = await User.findById(userId).exec()
        if (!dbUser) {
            return null
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
            return null
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
        const bugsCount = await Bug.countDocuments({ creatorId: userId })

        if (bugsCount > 0) {
            throw `User cannot be removed. ${bugsCount} bug(s) are associated with the user.`
        }

        // don't allow removing a user that has comments
        const commentsCount = await Comment.countDocuments({
            creatorId: userId,
        })

        if (commentsCount > 0) {
            throw `User cannot be removed. ${commentsCount} comments(s) are associated with the user.`
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

// return the user as an object, excluding the password and version fields
function _toObject(dbUser, deletePassword = true) {
    const obj = dbUser.toObject({
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
