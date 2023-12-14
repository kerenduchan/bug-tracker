import { utilService } from '../../services/util.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    create,
    update,
}

const FILENAME = './data/user.json'

var users = utilService.readJsonFile(FILENAME)

async function query(
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    return utilService.query(
        users,
        _isMatchFilter,
        filterBy,
        sortBy,
        sortDir,
        pageIdx,
        pageSize
    )
}

async function getById(userId) {
    return utilService.getById(userId, users)
}

async function getByUsername(username) {
    return users.find((user) => user.username === username)
}

async function remove(userId) {
    utilService.remove(userId, users, FILENAME)
}

// Create a new user
async function create(user) {
    return utilService.create(user, _validateUserFields, users, FILENAME)
}

// Update an existing bug
async function update(user) {
    return utilService.update(user, _validateUserFields, users, FILENAME)
}

// Ignore any unknown fields and validate the known fields
function _validateUserFields(user, isNew) {
    const res = {}

    const mandatoryFields = ['username', 'fullname', 'password']

    // if is new, some fields are mandatory
    if (isNew) {
        const missingFields = mandatoryFields.filter((field) => !user[field])
        if (missingFields.length) {
            throw `Missing mandatory field${
                missingFields.length > 1 ? 's' : ''
            }: ${missingFields.join(', ')}`
        }

        // default values for optional fields
        res.score = 100
    }

    mandatoryFields.forEach((field) => (res[field] = user[field]))

    if (user.score !== undefined) {
        const score = +user.score
        if (score < 0 || score > 100) {
            throw 'User score must be between 0-100'
        }
        res.score = score
    }

    return res
}

function _isMatchFilter(user, filterBy) {
    filterBy.txt = filterBy.txt?.toLowerCase()

    if (
        !user.username.toLowerCase().includes(filterBy.txt) &&
        !user.fullname.toLowerCase().includes(filterBy.txt)
    ) {
        return false
    }

    if (filterBy.minScore > user.score) {
        return false
    }
    return true
}
