import { Schema, model, SchemaTypes } from 'mongoose'
import { dbUtil } from '../dbUtil.js'
import User from './User.js'
import { bugService } from '../../api/bug/bug.service.js'

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
    creatorId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'creatorId is required'],
        validate: {
            validator: async function (userId) {
                const user = await User.findById(userId)
                return !!user
            },
            message: 'Invalid creatorId. User does not exist.',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// sanitize the labels before create, if given
bugSchema.pre('save', function (next) {
    this.labels = bugService.sanitizeLabels(this.labels)
    next()
})

// sanitize the labels before update, if labels changed
bugSchema.pre('findOneAndUpdate', function (next) {
    this._update.labels = bugService.sanitizeLabels(this._update.labels)
    next()
})

const Bug = model('Bug', bugSchema)
export default Bug
