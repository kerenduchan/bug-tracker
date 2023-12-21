import { utilService } from '../../services/util.service.js'
import { userService } from '../user/user.service.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { bugService } from '../bug/bug.service.js'

export const commentService = {
    query,
    getById,
    remove,
    create,
    update,
}

const ENTITY_TYPE = 'comment'

// fields that can be set when the comment is created
const CREATE_FIELDS = ['bugId', 'txt']

// mandatory fields that must be set when the comment is created
const MANDATORY_CREATE_FIELDS = ['bugId', 'txt']

// fields that can be set when the comment is updated
const UPDATE_FIELDS = ['txt']

const VALID_TXT_LENGTH = { min: 1, max: 300 }

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
            .find(criteria)
            .sort({ [sortBy]: sortDir })

        if (pageIdx !== undefined) {
            const startIdx = pageIdx * pageSize
            cursor.skip(startIdx).limit(pageSize)
        }
        const comments = await cursor.toArray()
        const totalCount = await collection.countDocuments(criteria)
        return { data: comments, totalCount }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(commentId) {
    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const _id = utilService.createObjectId(commentId)
        const comment = await collection.findOne({ _id })
        if (!comment) throw `Failed to find comment with ID ${_id}`
        return comment
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(commentId, loggedinUser) {
    await _validateIsCreatorOrAdmin(commentId, loggedinUser)

    try {
        const _id = utilService.createObjectId(commentId)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const { deletedCount } = await collection.deleteOne({ _id })
        return { deletedCount }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function create(comment, loggedinUser) {
    console.log('create')
    // disregard unexpected fields
    comment = utilService.extractFields(comment, CREATE_FIELDS)
    utilService.validateMandatoryFields(comment, MANDATORY_CREATE_FIELDS)

    // Store as little as possible because this data is duplicated in the DB.
    // Changing these fields on the user would require changing them on all the
    // user's comments.
    comment.creator = {
        _id: loggedinUser._id,
        username: loggedinUser.username,
        fullname: loggedinUser.fullname,
    }

    comment.createdAt = Date.now()

    try {
        await _validateComment(comment)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.insertOne(comment)
        return { _id: result.insertedId, ...comment }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(comment, loggedinUser) {
    await _validateIsCreatorOrAdmin(comment._id, loggedinUser)

    let _id = comment._id

    // disregard unexpected fields
    comment = utilService.extractFields(comment, UPDATE_FIELDS)

    try {
        await _validateComment(comment, _id)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.updateOne(
            { _id: utilService.createObjectId(_id) },
            { $set: comment }
        )

        if (result.matchedCount === 0) {
            throw `Comment with ID ${_id} does not exist`
        }
        return { msg: 'Updated OK' }
    } catch (err) {
        loggerService.error(`Failed to update comment with ID ${_id}`, err)
        throw err
    }
}

async function _validateComment(comment) {
    const { txt, bugId } = comment

    // title
    utilService.validateStringLength('txt', txt, VALID_TXT_LENGTH)

    // bugId (make sure it exists)
    if (bugId) {
        await bugService.getById(bugId)
    }
}

async function _validateIsCreatorOrAdmin(commentId, loggedinUser) {
    if (!commentId) {
        throw 'missing comment ID'
    }
    const comment = await getById(commentId)
    const user = await userService.getById(loggedinUser._id)
    if (!user.isAdmin && loggedinUser._id !== comment.creator._id) {
        throw 'Not authorized'
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    // txt
    if (filterBy.txt && filterBy.txt.length > 0) {
        criteria.txt = { $regex: filterBy.txt, $options: 'i' }
    }

    // creator username
    if (filterBy.creatorUsername) {
        criteria['creator.username'] = filterBy.creatorUsername
    }

    // creator id
    if (filterBy.creatorId) {
        criteria['creator._id'] = filterBy.creatorId
    }

    return criteria
}
