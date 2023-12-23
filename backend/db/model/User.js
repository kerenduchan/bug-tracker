import { Schema, model } from 'mongoose'
import { dbUtil } from '../dbUtil.js'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'fullname is required'],
        validate: dbUtil.getStringLengthValidate('fullname', 1, 40),
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        validate: dbUtil.getStringLengthValidate('username', 4, 20),
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        validate: dbUtil.getStringLengthValidate('password', 4),
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    score: {
        type: Number,
        default: 0,
        validate: dbUtil.getNumberRangeValidate('score', 0, 100),
    },
})

// virtual 'createdAt' field based on the ObjectId timestamp
userSchema.virtual('createdAt').get(function () {
    return this._id.getTimestamp()
})

// hash the password before create
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// hash the password before update, if password changed
userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10)
    }
    next()
})

const User = model('User', userSchema)
export default User
