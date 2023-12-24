import { Schema, model, SchemaTypes } from 'mongoose'
import { dbUtil } from '../dbUtil.js'
import User from './User.js'

const bugSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        validate: dbUtil.getStringLengthValidate('title', 1, 100),
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        validate: dbUtil.getStringLengthValidate('title', 1, 1000),
    },
    severity: {
        type: Number,
        required: [true, 'severity is required'],
        validate: dbUtil.getNumberRangeValidate('severity', 1, 5),
    },
    labels: {
        type: [String],
        default: [],
    },
    creator: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'creator is required'],
        validate: {
            validator: async function (userId) {
                const user = await User.findById(userId)
                return !!user
            },
            message: 'Invalid creator. User does not exist.',
        },
    },
    comments: {
        type: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'Comment',
            },
        ],
    },
})

// virtual 'createdAt' field based on the ObjectId timestamp
bugSchema.virtual('createdAt').get(function () {
    return this._id.getTimestamp()
})

// sanitize the labels before create, if given
bugSchema.pre('save', function (next) {
    this.labels = _sanitizeLabels(this.labels)
    next()
})

// sanitize the labels before update, if labels changed
bugSchema.pre('findOneAndUpdate', function (next) {
    this._update.labels = _sanitizeLabels(this._update.labels)
    next()
})

function _sanitizeLabels(labels) {
    if (labels === undefined) {
        return labels
    }

    // trim the labels
    labels = labels.map((l) => l.trim())

    // remove duplicate labels and empty labels
    return [...new Set(labels)].filter((l) => l.length > 0)
}

const Bug = model('Bug', bugSchema)
export default Bug
