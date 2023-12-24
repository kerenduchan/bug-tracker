import { utilService } from '../../services/util.service.js'
import Bug from '../../db/model/Bug.js'
import Comment from '../../db/model/Comment.js'

export const bugService = {
    query,
    getById,
    remove,
    create,
    update,
}

// bug fields that can be set upon creation
const CREATE_FIELDS = [
    'title',
    'severity',
    'description',
    'labels',
    'creatorId',
]

// bug fields that can be updated
const fUPDATE_FIELDS = CREATE_FIELDS.filter((field) => field !== 'creatorId')

// query bugs (with filter, sort, pagination) and populate the creator of each
// bug
async function query(
    filterBy,
    sortBy,
    sortDir = 1,
    pageIdx = undefined,
    pageSize = 5
) {
    const criteria = _buildCriteria(filterBy)
    const totalCount = await Bug.countDocuments(criteria)

    // lookup, project, and filter
    const pipeline = [
        {
            $lookup: {
                from: 'users',
                localField: 'creatorId',
                foreignField: '_id',
                as: 'creator',
            },
        },
        {
            $unwind: '$creator',
        },
        {
            $project: {
                title: 1,
                description: 1,
                severity: 1,
                labels: 1,
                createdAt: 1,
                'creator._id': 1,
                'creator.username': 1,
                'creator.fullname': 1,
            },
        },
        {
            $match: criteria,
        },
    ]

    // sort
    if (sortBy) {
        pipeline.push({ $sort: { [sortBy]: sortDir } })
    }

    // pagination
    if (pageIdx !== undefined) {
        const startIdx = pageIdx * pageSize
        pipeline.push({ $skip: startIdx }, { $limit: pageSize })
    }

    try {
        const bugs = await Bug.aggregate(pipeline).exec()
        return { data: bugs, totalCount }
    } catch (err) {
        throw err
    }
}

// get bug by ID and populate the creator of the bug
async function getById(bugId) {
    try {
        const dbBug = await Bug.findById(bugId)
            .populate({
                path: 'creatorId',
                select: 'username fullname',
            })
            .exec()
        if (!dbBug) {
            throw `Bug not found`
        }
        return _toObject(dbBug)
    } catch (err) {
        _handleError(err)
    }
}

async function remove(bugId) {
    try {
        // remove all the comments of the bug before removing the bug
        await Comment.deleteMany({ bugId })
        const { deletedCount } = await Bug.deleteOne({ _id: bugId })
        return { deletedCount }
    } catch (err) {
        _handleError(err)
    }
}

async function create(bug) {
    // disregard unexpected fields
    bug = utilService.extractFields(bug, CREATE_FIELDS)

    try {
        const dbBug = await Bug.create(bug)
        return _toObject(dbBug)
    } catch (err) {
        _handleError(err)
    }
}

async function update(bugId, bug) {
    // disregard unexpected fields
    bug = utilService.extractFields(bug, UPDATE_FIELDS)
    const options = { new: true, runValidators: true }

    try {
        const updatedBug = await Bug.findOneAndUpdate(
            { _id: bugId },
            bug,
            options
        )
            .populate({
                path: 'creatorId',
                select: 'username fullname',
            })
            .exec()
        return _toObject(updatedBug)
    } catch (err) {
        _handleError(err)
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

    // creator id
    if (filterBy.creatorId) {
        criteria.creator = filterBy.creator
    }

    // labels
    if (filterBy.labels?.length) {
        const labels = _sanitizeLabels(filterBy.labels)

        criteria.labels = { $in: labels }
    }

    return criteria
}

// return the bug as an object, excluding the version field
function _toObject(dbBug) {
    const obj = dbBug.toObject({
        versionKey: false,
    })

    if (typeof obj.creatorId === 'object') {
        // move the populated creatorId into the creator field
        obj.creator = obj.creatorId
        obj.creatorId = obj.creator._id
    }

    if (obj.creator) {
        delete obj.creator.createdAt
        delete obj.creator.id
    }
    delete obj.id
    return obj
}

// don't expose the DB - formulate our own error messages
function _handleError(err) {
    utilService.handleDbError(err)
}
