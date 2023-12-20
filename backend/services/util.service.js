import fs from 'fs'
import http from 'http'
import https from 'https'
import { ObjectId } from 'mongodb'

export const utilService = {
    createObjectId,
    readJsonFile,
    writeJsonFile,
    download,
    httpGet,
    makeId,
    toNumber,
    validateMandatoryFields,
    extractFields,
    validateStringLength,
    validateNumber,
}

function createObjectId(id) {
    try {
        return new ObjectId(id)
    } catch (err) {
        throw `Invalid ID: ${id}`
    }
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function writeJsonFile(path, obj) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(obj, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET',
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })
}

function makeId(length = 5) {
    let text = ''
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function toNumber(s) {
    const res = s && +s
    if (s === NaN) {
        return undefined
    }
    return res
}

function validateMandatoryFields(obj, mandatoryFields) {
    const missingFields = mandatoryFields.filter(
        (field) => obj[field] === undefined || obj[field] === null
    )
    if (missingFields.length) {
        throw `Missing mandatory field${
            missingFields.length > 1 ? 's' : ''
        }: ${missingFields.join(', ')}`
    }
}

function extractFields(entity, fields) {
    let res = {}
    fields.forEach((field) => {
        if (entity[field] !== undefined) {
            res[field] = entity[field]
        }
    })
    return res
}

function validateStringLength(fieldName, value, allowedLength) {
    const { min, max } = allowedLength

    if (value === undefined) {
        return
    }

    if (typeof value !== 'string') {
        throw `${fieldName} must be a string`
    }

    if (min && value.length < min) {
        throw `${fieldName} must be at least ${min} characters`
    }

    if (max && value.length > max) {
        throw `${fieldName} must be at most ${max} characters`
    }
}

function validateNumber(fieldName, value, allowedRange) {
    const { min, max } = allowedRange

    if (value === undefined) {
        return
    }

    if (typeof value !== 'number') {
        throw `${fieldName} must be a number`
    }

    if (min && value < min) {
        throw `${fieldName} must be at least ${min}`
    }

    if (max && value > max) {
        throw `${fieldName} must be at most ${max}`
    }
}
