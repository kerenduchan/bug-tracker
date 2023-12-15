import { utilService } from '../../services/util.service.js'
import bcrypt from 'bcrypt'
import { bugService } from '../bug/bug.service.js'

const HASH_SALT_ROUNDS = 10

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
    const foundUsers = await utilService.query(
        users,
        _isMatchFilter,
        filterBy,
        sortBy,
        sortDir,
        pageIdx,
        pageSize
    )

    foundUsers.data = await _expandUserBugs(foundUsers.data)
    return foundUsers
}

async function getById(userId) {
    const user = await utilService.getById('user', userId, users)
    const [expandedUser] = await _expandUserBugs([user])
    return expandedUser
}

async function getByUsername(username) {
    return users.find((user) => user.username === username)
}

async function remove(userId) {
    // don't allow removing a user that has bugs
    const userBugs = await bugService.getByCreatorId(userId)
    if (userBugs.length > 0) {
        throw 'Cannot delete a user that has bugs'
    }

    utilService.remove('user', userId, users, FILENAME)
}

async function create(user) {
    return utilService.create(user, _processUserFields, users, FILENAME)
}

async function update(user) {
    return await utilService.update(
        'user',
        user,
        _processUserFields,
        users,
        FILENAME
    )
}

// Ignore any unknown fields, validate the known fields, and add any needed
// fields
async function _processUserFields(user, isNew) {
    const fields = ['username', 'fullname', 'password', 'score']

    // disregard unrecognized fields
    let res = {}
    fields.forEach((field) => {
        if (user[field] !== undefined) {
            res[field] = user[field]
        }
    })

    // special handling for create
    if (isNew) {
        // set is admin
        res['isAdmin'] = false

        // check that all mandatory fields were supplied
        const mandatoryFields = ['username', 'fullname', 'password']
        utilService.validateMandatoryFields(res, mandatoryFields)

        // check that the username isn't taken
        const userExists = await getByUsername(user.username)
        if (userExists) throw 'Username already taken'

        // hash the password
        res.password = await bcrypt.hash(res.password, HASH_SALT_ROUNDS)

        // default values for optional fields
        if (res.score === undefined) {
            res.score = 100
        }
    }

    // validate the score field
    if (res.score !== undefined) {
        res.score = +res.score
        if (res.score < 0 || res.score > 100) {
            throw 'User score must be between 0-100'
        }
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

async function _expandUserBugs(usersToExpand) {
    let expandedUsers = []
    for (const user of usersToExpand) {
        const userBugs = bugService.getByCreatorId(user._id)
        expandedUsers.push({
            ...user,
            bugs: userBugs.map((bug) => ({ _id: bug._id, title: bug.title })),
        })
    }
    return expandedUsers
}
