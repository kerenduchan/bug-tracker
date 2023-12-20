import { utilService } from '../../services/util.service.js'
import bcrypt from 'bcrypt'
import { bugService } from '../bug/bug.service.js'

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

async function query(
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    // TODO: sort
    const criteria = _buildCriteria(filterBy)
    return utilService.query(ENTITY_TYPE, criteria, pageIdx, pageSize)
}

async function getById(userId) {
    return utilService.getById(ENTITY_TYPE, userId)
}

async function getByUsername(username) {
    const criteria = { username }
    return utilService.findOne(ENTITY_TYPE, criteria)
}

async function remove(userId) {
    // TODO don't allow removing a user that has bugs
    // const userBugs = await bugService.getByCreatorId(userId)
    // if (userBugs.length > 0) {
    //     throw 'Cannot delete a user that has bugs'
    // }

    utilService.remove(ENTITY_TYPE, userId)
}

async function create(user) {
    console.log('create user')
    console.log(user)
    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)
    console.log('after extract fields')
    console.log(user)

    const mandatoryFields = ['username', 'fullname', 'password']
    utilService.validateMandatoryFields(user, mandatoryFields)

    user.isAdmin = false
    user.password = await bcrypt.hash(user.password, HASH_SALT_ROUNDS)

    // default values for optional fields
    if (user.score === undefined) {
        user.score = 100
    }

    // validations
    user.score = _validateScore(user.score)

    const existingUser = await getByUsername(user.username)
    if (existingUser) {
        throw `Username ${user.username} is taken`
    }
    // TODO: validate username / fullname field lengths

    return await utilService.create(ENTITY_TYPE, user)
}

async function update(user) {
    const _id = user._id

    // disregard unexpected fields
    user = utilService.extractFields(user, FIELDS)

    // validations
    user.score = _validateScore(user.score)

    const existingUser = await getByUsername(user.username)
    if (existingUser && existingUser._id.toString() !== _id) {
        throw `Username ${user.username} is taken`
    }

    // TODO: validate username / fullname field lengths

    return await utilService.update(ENTITY_TYPE, _id, user)
}

function _validateScore(score) {
    if (score === undefined) {
        return
    }
    score = +score
    if (isNaN(score) || score < 0 || score > 100) {
        throw 'User score must be between 0-100'
    }
    return score
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
