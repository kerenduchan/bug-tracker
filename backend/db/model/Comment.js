import { Schema, model, SchemaTypes } from 'mongoose'
import User from './User.js'
import Bug from './Bug.js'

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'text is required'],
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
    bugId: {
        type: SchemaTypes.ObjectId,
        ref: 'Bug',
        required: [true, 'bugId is required'],
        validate: {
            validator: async function (bugId) {
                const bug = await Bug.findById(bugId)
                return !!bug
            },
            message: 'Invalid bugId. Bug does not exist.',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Comment = model('Comment', commentSchema)
export default Comment
