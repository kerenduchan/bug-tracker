// Bug CRUDL API
import { utilService } from '../../services/util.service.js'
import { bugService } from './bug.service.js'

// List
export async function getBugs(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minSeverity: +req.query.minSeverity || 0,
            labels:
                req.query.labels === ''
                    ? []
                    : req.query.labels?.split(',') || undefined,
        }
        const data = await bugService.query(
            filterBy,
            req.query.sortBy,
            utilService.toNumber(req.query.sortDir),
            utilService.toNumber(req.query.pageIdx),
            utilService.toNumber(req.query.pageSize)
        )
        res.send(data)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`)
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
        res.status(400).send(err)
    }
}

// // Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        await bugService.remove(bugId)
        res.send('Deleted OK')
    } catch (err) {
        res.status(400).send(`Couldn't remove bug`)
    }
}

// // Save
export async function addBug(req, res) {
    try {
        const savedBug = await bugService.create(req.body)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(err)
    }
}

export async function updateBug(req, res) {
    try {
        const savedBug = await bugService.update(req.body)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(err)
    }
}
