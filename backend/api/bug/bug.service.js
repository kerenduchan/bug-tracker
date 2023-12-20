import { utilService } from '../../services/util.service.js'
import { userService } from '../user/user.service.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    getByCreatorId,
    remove,
    create,
    update,
}

const ENTITY_TYPE = 'bug'

const FILENAME = './data/bug.json'

var bugs = utilService.readJsonFile(FILENAME)

async function query(
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    const expandedBugs = await _expandCreator(bugs)

    const foundBugs = await utilService.query(
        expandedBugs,
        _isMatchFilter,
        filterBy,
        sortBy,
        sortDir,
        pageIdx,
        pageSize
    )
    return foundBugs
}

async function getById(bugId) {
    return utilService.getById(ENTITY_TYPE, bugId)
}

function getByCreatorId(creatorId) {
    return bugs.filter((bug) => bug.creatorId === creatorId)
}

async function remove(bugId, loggedinUserId) {
    await _validateIsCreatorOrAdmin(bugId, loggedinUserId)
    utilService.remove(ENTITY_TYPE, bugId)
}

async function create(bug, loggedinUserId) {
    bug = { ...bug, creatorId: loggedinUserId }
    bug = _processBugFields(newBug, true)
    return await userService.create(ENTITY_TYPE, bug)
}

async function update(bug, loggedinUserId) {
    await _validateIsCreatorOrAdmin(bug._id, loggedinUserId)
    const fieldsToUpdate = _processBugFields(bug, false)
    return await utilService.update(ENTITY_TYPE, bug._id, fieldsToUpdate)
}

// Ignore any unknown fields, validate the known fields, and add any needed
// fields
function _processBugFields(bug, isNew) {
    const fields = ['title', 'severity', 'description', 'labels']

    // disregard unrecognized fields
    let res = {}
    fields.forEach((field) => {
        if (bug[field] !== undefined) {
            res[field] = bug[field]
        }
    })

    // special handling for create
    if (isNew) {
        // set the creator ID
        res['creatorId'] = bug['creatorId']

        // check that all mandatory fields were supplied
        const mandatoryFields = ['title', 'severity']
        utilService.validateMandatoryFields(res, mandatoryFields)

        // set default values for optional fields that were not supplied
        if (res.labels === undefined) {
            res.labels = []
        }

        if (res.description === undefined) {
            res.description = ''
        }
    }

    // validate the labels field
    if (res.labels !== undefined) {
        if (!Array.isArray(res.labels)) {
            throw 'labels must be an array of strings'
        }
        res.labels.forEach((l) => {
            if (typeof l !== 'string') {
                throw 'labels must be an array of strings'
            }
        })

        // trim the labels
        res.labels = res.labels.map((l) => l.trim())

        // remove duplicate labels and empty labels
        res.labels = [...new Set(res.labels)].filter((l) => l.length > 0)
    }

    // validate the severity
    if (res.severity !== undefined) {
        const severity = +res.severity
        if (severity < 1 || severity > 5) {
            throw 'Bug severity must be between 1-5'
        }
    }

    return res
}

function _isMatchFilter(bug, filterBy) {
    filterBy.txt = filterBy.txt?.toLowerCase()
    filterBy.labels = filterBy.labels
        ?.map((l) => l.toLowerCase())
        .filter((l) => l.length > 0)

    const lowercaseLabels = bug.labels.map((l) => l.toLowerCase())

    // text filtering
    if (
        !bug.description.toLowerCase().includes(filterBy.txt) &&
        !bug.title.toLowerCase().includes(filterBy.txt)
    ) {
        return false
    }

    // labels filtering
    if (
        filterBy.labels?.length > 0 &&
        filterBy.labels?.every((l) => !lowercaseLabels.includes(l))
    ) {
        return false
    }

    // min severity filtering
    if (filterBy.minSeverity > bug.severity) {
        return false
    }

    // creator filtering
    if (
        filterBy.creatorUsername &&
        filterBy.creatorUsername !== bug.creator.username
    ) {
        return false
    }

    return true
}

async function _validateIsCreatorOrAdmin(bugId, loggedinUserId) {
    if (!bugId) {
        throw 'missing bug ID'
    }
    const bug = await getById(bugId)
    const user = await userService.getById(loggedinUserId)
    if (!user.isAdmin && loggedinUserId !== bug.creatorId) {
        throw 'Not authorized'
    }
}

async function _expandCreator(bugsToExpand) {
    let expandedBugs = []
    for (const bug of bugsToExpand) {
        const creator = await userService.getById(bug.creatorId)
        expandedBugs.push({
            ...bug,
            creator: {
                _id: creator._id,
                username: creator.username,
                fullname: creator.fullname,
            },
        })
    }
    return expandedBugs
}

async function _getCollection() {
    return dbService.getCollection('bug')
}
