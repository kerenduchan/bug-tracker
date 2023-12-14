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
async function create(bug, creatorId) {
    const newBug = { ...bug, creatorId }
    return utilService.create(newBug, _validateBugFields, bugs, FILENAME)
}

// Update an existing bug
async function update(bug) {
    return utilService.update(bug, _validateBugFields, bugs, FILENAME)
}

// Ignore any unknown fields and validate the known fields
function _validateBugFields(bug, isNew) {
    const fields = ['title', 'severity', 'description', 'labels', 'creatorId']

    // disregard unrecognized fields
    let res = {}
    fields.forEach((field) => (res[field] = bug[field]))

    // if is new, check that all mandatory fields were given
    if (isNew) {
        const mandatoryFields = ['title', 'severity']
        mandatoryFields.forEach((field) => {
            if (!res[field]) {
                throw `Missing mandatory field: ${field}`
            }
        })

        // default values for optional fields
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
