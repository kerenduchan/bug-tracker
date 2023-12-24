import { utilService } from '../../services/util.service.js'
import Comment from '../../db/model/Comment.js'

export const commentService = {
    query,
    getById,
    remove,
    create,
    update,
}

// bug fields that can be set upon creation
const CREATE_FIELDS = ['text', 'creator', 'bug']

// bug fields that can be updated
const UPDATE_FIELDS = ['text']

// query comments (with filter, sort, pagination) and populate the creator of each
// comment
async function query(
    filterBy,
    sortBy,
    sortDir = 1,
    pageIdx = undefined,
    pageSize = 5
) {
    const criteria = _buildCriteria(filterBy)
    const totalCount = await Comment.countDocuments(criteria)

    // lookup, project, and filter
    const pipeline = [
        {
            $lookup: {
                from: 'users',
                localField: 'creator',
                foreignField: '_id',
                as: 'creator',
            },
        },
        {
            $unwind: '$creator',
        },
        {
            $project: {
                text: 1,
                bug: 1,
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
        const comments = await Comment.aggregate(pipeline).exec()
        return { data: comments, totalCount }
    } catch (err) {
        throw err
    }
}

// get comment by ID and populate the creator of the comment
async function getById(commentId) {
    try {
        const dbComment = await Comment.findById(commentId)
            .populate({ path: 'creator', select: 'username fullname' })
            .exec()
        if (!dbComment) {
            throw `Comment not found`
        }
        return _toObject(dbComment)
    } catch (err) {
        _handleError(err)
    }
}

async function remove(commentId) {
    try {
        const { deletedCount } = await Comment.deleteOne({ _id: commentId })
        return { deletedCount }
    } catch (err) {
        _handleError(err)
    }
}

async function create(comment) {
    // disregard unexpected fields
    comment = utilService.extractFields(comment, CREATE_FIELDS)

    try {
        const dbComment = await Comment.create(comment)
        return _toObject(dbComment)
    } catch (err) {
        _handleError(err)
    }
}

async function update(commentId, comment) {
    // disregard unexpected fields
    comment = utilService.extractFields(comment, UPDATE_FIELDS)
    const options = { new: true, runValidators: true }

    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId },
            comment,
            options
        )
            .populate({ path: 'creator', select: 'username fullname' })
            .exec()
        return _toObject(updatedComment)
    } catch (err) {
        _handleError(err)
    }
}

function _toObject(dbComment) {
    const obj = dbComment.toObject({
        virtuals: true,
        versionKey: false,
    })

    delete obj.id
    delete obj.creator.createdAt
    delete obj.creator.id
    return obj
}

function _handleError(err) {
    utilService.handleDbError(err)
}

function _buildCriteria(filterBy) {
    const { bugId, creatorUsername, creatorId, text } = filterBy
    const criteria = {
        bugId,
        'creator.username': creatorUsername,
        'creator._id': creatorId,
    }

    // text
    if (text && text.length > 0) {
        criteria.txt = { $regex: text, $options: 'i' }
    }

    return utilService.removeNullAndUndefined(criteria)
}
