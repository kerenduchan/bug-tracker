import { utilService } from '../../services/util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    create,
    update,
}

const FILENAME = './data/bug.json'

var bugs = utilService.readJsonFile(FILENAME)

async function query(
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    return utilService.query(
        bugs,
        _isMatchFilter,
        filterBy,
        sortBy,
        sortDir,
        pageIdx,
        pageSize
    )
}

async function getById(bugId) {
    return utilService.getById(bugId, bugs)
}

async function remove(bugId, loggedinUserId) {
    await _validateIsCreator(bugId, loggedinUserId)
    utilService.remove(bugId, bugs, FILENAME)
}

async function create(bug, loggedinUserId) {
    const newBug = { ...bug, creatorId: loggedinUserId }
    return utilService.create(newBug, _processBugFields, bugs, FILENAME)
}

async function update(bug, loggedinUserId) {
    await _validateIsCreator(bug._id, loggedinUserId)
    return utilService.update(bug, _processBugFields, bugs, FILENAME)
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
    filterBy.labels = filterBy.labels?.map((l) => l.toLowerCase())

    const lowercaseLabels = bug.labels.map((l) => l.toLowerCase())

    if (
        !bug.description.toLowerCase().includes(filterBy.txt) &&
        !bug.title.toLowerCase().includes(filterBy.txt)
    ) {
        return false
    }

    if (
        filterBy.labels?.length > 0 &&
        filterBy.labels?.every((l) => !lowercaseLabels.includes(l))
    ) {
        return false
    }

    if (filterBy.minSeverity > bug.severity) {
        return false
    }
    return true
}

async function _validateIsCreator(bugId, loggedinUserId) {
    if (!bugId) {
        throw 'missing bug ID'
    }
    const bug = await getById(bugId)
    if (loggedinUserId != bug.creatorId) {
        throw 'Unauthorized - only the creator of this bug is authorized to perform this action'
    }
}
