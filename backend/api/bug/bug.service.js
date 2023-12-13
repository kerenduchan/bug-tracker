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

async function remove(bugId) {
    utilService.remove(bugId, bugs, FILENAME)
}

// Create a new bug
async function create(bug) {
    return utilService.create(bug, _validateBugFields, bugs, FILENAME)
}

// Update an existing bug
async function update(bug) {
    return utilService.update(bug, _validateBugFields, bugs, FILENAME)
}

// Ignore any unknown fields and validate the known fields
function _validateBugFields(bug, isNew) {
    const res = {}

    // if is new, some fields are mandatory
    if (isNew) {
        const mandatoryFields = ['title', 'severity']
        mandatoryFields.forEach((field) => {
            if (!bug[field]) {
                throw `Missing mandatory field: ${field}`
            }
        })
        // default values for optional fields
        res.labels = []
        res.description = ''
    }

    if (bug.description !== undefined) {
        res.description = bug.description
    }

    if (bug.title !== undefined) {
        res.title = bug.title
    }

    if (bug.labels !== undefined) {
        if (!Array.isArray(bug.labels)) {
            throw 'labels must be an array of strings'
        }
        bug.labels.forEach((l) => {
            if (typeof l !== 'string') {
                throw 'labels must be an array of strings'
            }
        })
        res.labels = bug.labels
    }

    if (bug.severity !== undefined) {
        const severity = +bug.severity
        if (severity < 1 || severity > 5) {
            throw 'Bug severity must be between 1-5'
        }
        res.severity = severity
    }

    return res
}

function _isMatchFilter(bug, filterBy) {
    filterBy.txt = filterBy.txt?.toLowerCase()

    const lowercaseBug = {
        title: bug.title.toLowerCase(),
        description: bug.description.toLowerCase(),
        labels: bug.labels.map((l) => l.toLowerCase()),
    }

    if (
        !lowercaseBug.description.includes(filterBy.txt) &&
        !lowercaseBug.title.includes(filterBy.txt)
    ) {
        return false
    }

    if (
        filterBy.labels?.length > 0 &&
        filterBy.labels?.every((l) => !lowercaseBug.labels.includes(l))
    ) {
        return false
    }

    if (filterBy.minSeverity > bug.severity) {
        return false
    }
    return true
}
