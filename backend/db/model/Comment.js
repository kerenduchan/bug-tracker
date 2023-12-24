import { Schema, model, SchemaTypes } from 'mongoose'
import User from './User.js'
import Bug from './Bug.js'

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'text is required'],
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
    bug: {
        type: SchemaTypes.ObjectId,
        ref: 'Bug',
        required: [true, 'bug is required'],
        validate: {
            validator: async function (bugId) {
                const bug = await Bug.findById(bugId)
                return !!bug
            },
            message: 'Invalid bug. Bug does not exist.',
        },
    },
})

// virtual 'createdAt' field based on the ObjectId timestamp
commentSchema.virtual('createdAt').get(function () {
    return this._id.getTimestamp()
})

const Comment = model('Comment', commentSchema)
export default Comment
