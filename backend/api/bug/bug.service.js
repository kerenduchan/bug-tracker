import { utilService } from '../../services/util.service.js'
import { userService } from '../user/user.service.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    create,
    update,
}

const ENTITY_TYPE = 'bug'

// bug fields that can be set/updated
const FIELDS = ['title', 'severity', 'description', 'labels']

const VALID_TITLE_LENGTH = { min: 1, max: 100 }
const VALID_DESCRIPTION_LENGTH = { min: 1, max: 1000 }
const VALID_SEVERITY_RANGE = { min: 1, max: 5 }

async function query(
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    // TODO: sort
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const cursor = await collection.find(criteria)

        if (pageIdx !== undefined) {
            const startIdx = pageIdx * pageSize
            cursor.skip(startIdx).limit(pageSize)
        }
        const bugs = await cursor.toArray()
        return bugs
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const _id = utilService.createObjectId(bugId)
        const bug = await collection.findOne({ _id })
        if (!bug) throw `Failed to find bug with ID ${_id}`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    await _validateIsCreatorOrAdmin(bugId, loggedinUser)

    try {
        const _id = utilService.createObjectId(bugId)
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const { deletedCount } = await collection.deleteOne({ _id })
        return { deletedCount }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function create(bug, loggedinUser) {
    // disregard unexpected fields
    bug = utilService.extractFields(bug, FIELDS)

    const mandatoryFields = ['title', 'severity']
    utilService.validateMandatoryFields(bug, mandatoryFields)

    bug.creator = loggedinUser
    // default values for optional fields
    if (bug.description === undefined) {
        bug.description = ''
    }

    if (bug.labels === undefined) {
        bug.labels = []
    }

    _validateBug(bug)
    bug.labels = _sanitizeLabels(bug.labels)

    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.insertOne(bug)
        return { _id: result.insertedId, ...bug }
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(bug, loggedinUser) {
    await _validateIsCreatorOrAdmin(bug._id, loggedinUser)

    let _id = bug._id

    // disregard unexpected fields
    bug = utilService.extractFields(bug, FIELDS)

    _validateBug(bug, _id)

    if (bug.labels) {
        bug.labels = _sanitizeLabels(bug.labels)
    }

    try {
        const collection = await dbService.getCollection(ENTITY_TYPE)
        const result = await collection.updateOne(
            { _id: utilService.createObjectId(_id) },
            { $set: bug }
        )

        if (result.matchedCount === 0) {
            throw `Bug with ID ${_id} does not exist`
        }
        return { msg: 'Updated OK' }
    } catch (err) {
        loggerService.error(`Failed to update bug with ID ${_id}`, err)
        throw err
    }
}

function _validateBug(bug) {
    const { title, description, severity, labels } = bug

    // title
    utilService.validateStringLength('title', title, VALID_TITLE_LENGTH)

    // description
    utilService.validateStringLength(
        'description',
        description,
        VALID_DESCRIPTION_LENGTH
    )

    // labels
    if (labels !== undefined) {
        if (!Array.isArray(labels)) {
            throw 'labels must be an array of strings'
        }
        labels.forEach((l) => {
            if (typeof l !== 'string') {
                throw 'labels must be an array of strings'
            }
        })
    }

    // severity
    utilService.validateNumber('severity', severity, VALID_SEVERITY_RANGE)
}

function _sanitizeLabels(labels) {
    // trim the labels
    labels = labels.map((l) => l.trim())

    // remove duplicate labels and empty labels
    return [...new Set(labels)].filter((l) => l.length > 0)
}

async function _validateIsCreatorOrAdmin(bugId, loggedinUser) {
    if (!bugId) {
        throw 'missing bug ID'
    }
    const bug = await getById(bugId)
    const user = await userService.getById(loggedinUser._id)
    if (!user.isAdmin && loggedinUser._id !== bug.creator._id) {
        throw 'Not authorized'
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    // min severity
    if (filterBy.minSeverity) {
        criteria.severity = { $gte: filterBy.minSeverity }
    }

    // txt
    if (filterBy.txt && filterBy.txt.length > 0) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                description: txtCriteria,
            },
            {
                title: txtCriteria,
            },
        ]
    }

    // creator username
    if (filterBy.creatorUsername) {
        criteria['creator.username'] = filterBy.creatorUsername
    }

    // labels
    if (filterBy.labels?.length) {
        const labels = _sanitizeLabels(filterBy.labels)

        criteria.labels = { $in: labels }
    }

    return criteria
}
