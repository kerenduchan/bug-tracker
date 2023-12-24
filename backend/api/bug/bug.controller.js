// Bug CRUDL API
import { utilService } from '../../services/util.service.js'
import { bugService } from './bug.service.js'

// List
export async function getBugs(req, res) {
    try {
        const filterBy = _buildFilter(req.query)
        const { sortBy, sortDir, pageIdx, pageSize } = req.query
        const data = await bugService.query(
            filterBy,
            sortBy,
            utilService.toNumber(sortDir),
            utilService.toNumber(pageIdx),
            utilService.toNumber(pageSize)
        )
        res.send(data)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// count
export async function getBugCount(req, res) {
    try {
        const filterBy = _buildFilter(req.query)
        const count = await bugService.count(filterBy)
        res.send({ count })
    } catch (err) {
        if (err.stack) console.error(err.stack)
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
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        const result = await bugService.remove(bugId)
        res.send(result)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

// // Save
export async function createBug(req, res) {
    try {
        const bug = { ...req.body, creatorId: req.loggedinUser._id }
        const savedBug = await bugService.create(bug)
        res.send(savedBug)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

export async function updateBug(req, res) {
    try {
        const savedBug = await bugService.update(req.params.bugId, req.body)
        res.send(savedBug)
    } catch (err) {
        if (err.stack) console.error(err.stack)
        res.status(400).send({ error: err })
    }
}

function _buildFilter(query) {
    const { txt, minSeverity, labels, creatorUsername, creatorId } = query

    const filter = {
        txt: txt === '' ? undefined : txt,
        minSeverity: utilService.toNumber(minSeverity),
        labels: labels?.length ? labels.split(',') : undefined,
        creatorUsername: creatorUsername === '' ? undefined : creatorUsername,
        creatorId: creatorId === '' ? undefined : creatorId,
    }

    return utilService.removeNullAndUndefined(filter)
}
