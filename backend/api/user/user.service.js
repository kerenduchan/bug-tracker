import { utilService } from '../../services/util.service.js'
import bcrypt from 'bcrypt'
import { bugService } from '../bug/bug.service.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    create,
    update,
}

const HASH_SALT_ROUNDS = 10

const ENTITY_TYPE = 'user'

// user fields that can be set/updated
const FIELDS = ['username', 'fullname', 'password', 'score']
const VALID_PASSWORD_LENGTH = { min: 4 }
const VALID_FULLNAME_LENGTH = { min: 1, max: 40 }
const VALID_USERNAME_LENGTH = { min: 4, max: 20 }
const VALID_SCORE_RANGE = { min: 0, max: 100 }
const PROJECTION = ['username', 'fullname', 'score', 'isAdmin']

async function query(
    filterBy,
    sortBy,
    sortDir = 1,
    pageIdx = undefined,
    pageSize = 5
) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const cursor = await collection
            .find(criteria, {
                projection: PROJECTION,
            })
            .sort({ [sortBy]: sortDir })

        if (pageIdx !== undefined) {
            const startIdx = pageIdx * pageSize
            cursor.skip(startIdx).limit(pageSize)
        }
        const users = await cursor.toArray()
        const totalCount = await collection.countDocuments(criteria)
        return { data: users, totalCount }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const _id = utilService.createObjectId(userId)
        const user = await collection.findOne(
            { _id },
            { projection: PROJECTION }
        )
        if (!user) throw `Failed to find user with ID ${_id}`
        return user
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    // don't allow removing a user that has bugs
    const userBugsCount = await bugService.count({ creatorId: userId })
    if (userBugsCount > 0) {
        throw 'Cannot delete a user that has bugs'
    }

    try {
        const _id = utilService.createObjectId(userId)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const { deletedCount } = await collection.deleteOne({ _id })
        return { deletedCount }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function create(user) {
    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)

    const mandatoryFields = ['username', 'fullname', 'password']
    utilService.validateMandatoryFields(user, mandatoryFields)

    user.isAdmin = false

    // default values for optional fields
    if (user.score === undefined) {
        user.score = 100
    }

    await _validateUser(user)

    // password hash
    user.password = await bcrypt.hash(user.password, HASH_SALT_ROUNDS)

    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.insertOne(user)
        delete user.password
        return { _id: result.insertedId, ...user }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(user) {
    let _id = user._id

    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)

    await _validateUser(user, _id)

    // password hash
    if (user.password) {
        user.password = await bcrypt.hash(user.password, HASH_SALT_ROUNDS)
    }

    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.updateOne(
            { _id: utilService.createObjectId(_id) },
            { $set: user }
        )

        if (result.matchedCount === 0) {
            throw `User with ID ${_id} does not exist`
        }
        return { msg: 'Updated OK' }
    } catch (err) {
        loggerService.error(`Failed to update user with ID ${_id}`, err)
        throw err
    }
}

async function _validateUser(user, _id = null) {
    const { score, password, fullname, username } = user

    // score
    utilService.validateNumber('score', score, VALID_SCORE_RANGE)

    // password
    utilService.validateStringLength(
        'password',
        password,
        VALID_PASSWORD_LENGTH
    )

    // full name
    utilService.validateStringLength(
        'fullname',
        fullname,
        VALID_FULLNAME_LENGTH
    )

    // username
    utilService.validateStringLength(
        'username',
        username,
        VALID_USERNAME_LENGTH
    )

    const existingUser = await getByUsername(username, _id)
    if (existingUser && (!_id || existingUser._id.toString() !== _id)) {
        throw `Username ${username} is taken`
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
