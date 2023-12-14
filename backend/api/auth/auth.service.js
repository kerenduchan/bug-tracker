import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Y4d8EM7ChFdx')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup,
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(username, password) {
    var user = await userService.getByUsername(username)
    if (!user) throw 'Invalid username or password'

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw 'Invalid username or password'

    // Removing passwords and personal data
    const miniUser = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
    return miniUser
}

async function signup({ username, password, fullname }) {
    const saltRounds = 10

    loggerService.debug(
        `auth.service - signup with username: ${username}, fullname: ${fullname}`
    )

    if (!username || !password || !fullname)
        throw 'Missing one or more mandatory field(s): username, password, fullname'

    const userExist = await userService.getByUsername(username)
    if (userExist) throw 'Username already taken'

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.create({ username, password: hash, fullname })
}
