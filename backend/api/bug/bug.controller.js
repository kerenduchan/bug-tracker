// Bug CRUDL API
import { utilService } from '../../services/util.service.js'
import { bugService } from './bug.service.js'

// List
export async function getBugs(req, res) {
    try {
        const filterBy = _buildFilter(req)
        const data = await bugService.query(
            filterBy,
            req.query.sortBy,
            utilService.toNumber(req.query.sortDir),
            utilService.toNumber(req.query.pageIdx),
            utilService.toNumber(req.query.pageSize)
        )
        res.send(data)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

// count
export async function getBugCount(req, res) {
    try {
        const filterBy = _buildFilter(req)
        const count = await bugService.count(filterBy)
        res.send({ count })
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

// Get
export async function getBug(req, res) {
    const { bugId } = req.params

    try {
        let visitedBugs = req.cookies.visitedBugs
            ? JSON.parse(req.cookies.visitedBugs)
            : {}

        visitedBugs[bugId] = true
        if (Object.keys(visitedBugs).length > 3) {
            throw 'Too many bugs visited. Wait a few seconds'
        }

        const bug = await bugService.getById(bugId)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), {
            maxAge: 7000,
        })
        res.send(bug)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

// // Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        const result = await bugService.remove(bugId, req.loggedinUser)
        res.send(result)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

// // Save
export async function createBug(req, res) {
    try {
        const savedBug = await bugService.create(req.body, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

export async function updateBug(req, res) {
    try {
        const savedBug = await bugService.update(req.body, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send({ error: err })
    }
}

function _buildFilter(req) {
    let filter = {}

    const { txt, minSeverity, labels, creatorUsername, creatorId } = req.query

    if (txt?.length) {
        filter.txt = txt
    }

    const minSeverityNum = utilService.toNumber(minSeverity)
    if (minSeverityNum) {
        filter.minSeverity = minSeverityNum
    }

    if (labels?.length) {
        filter.labels = labels.split(',')
    }

    if (creatorUsername?.length) {
        filter.creatorUsername = creatorUsername
    }

    if (creatorId?.length) {
        filter.creatorId = creatorId
    }

    return filter
}
