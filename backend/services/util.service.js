import fs from 'fs'
import http from 'http'
import https from 'https'
import { loggerService } from './logger.service.js'
import { ObjectId } from 'mongodb'
import { dbService } from './db.service.js'

export const utilService = {
    createObjectId,
    readJsonFile,
    writeJsonFile,
    download,
    httpGet,
    makeId,
    toNumber,
    remove,
    getById,
    create,
    update,
    query,
    findOne,
    validateMandatoryFields,
    extractFields,
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

async function remove(entityType, _id) {
    try {
        const collection = await dbService.getCollection(entityType)
        const { deletedCount } = await collection.deleteOne({
            _id: createObjectId(_id),
        })
        return { deletedCount }
    } catch (err) {
        loggerService.error(`Failed to delete ${entityType} by ID ${_id}`, err)
        throw err
    }
}

async function getById(entityType, _id) {
    console.log('get by ID', _id)
    try {
        const collection = await dbService.getCollection(entityType)
        _id = utilService.createObjectId(_id)
        const entity = await collection.findOne({ _id })
        if (!entity) throw `Failed to find ${entityType} with ID ${_id}`
        return entity
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function create(entityType, entity) {
    try {
        const collection = await dbService.getCollection(entityType)
        const result = await collection.insertOne(entity)
        return { _id: result.insertedId, ...entity }
    } catch (err) {
        loggerService.error(`Failed to insert ${entityType} into db:`, err)
        throw err
    }
}

async function update(entityType, _id, fieldsToUpdate) {
    try {
        const collection = await dbService.getCollection(entityType)
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: fieldsToUpdate }
        )
        console.log(result)

        if (result.matchedCount === 0) {
            throw `${entityType} with ID ${_id} does not exist`
        }
        return {
            changed: Boolean(result.modifiedCount),
        }
    } catch (err) {
        loggerService.error(
            `Failed to update ${entityType} with ID ${_id}`,
            err
        )
        throw err
    }
}

async function query(entityType, criteria, pageIdx, pageSize) {
    try {
        const collection = await dbService.getCollection(entityType)
        const cursor = await collection.find(criteria)

        if (pageIdx !== undefined) {
            const startIdx = pageIdx * pageSize
            cursor.skip(startIdx).limit(pageSize)
        }
        const entities = await cursor.toArray()
        return entities
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function findOne(entityType, criteria) {
    try {
        const collection = await dbService.getCollection(entityType)
        const entity = await collection.findOne(criteria)
        return entity
    } catch (err) {
        loggerService.error(err)
        throw err
    }
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

function _compare(bug1, bug2, sortBy, sortDir = 1) {
    const res = bug1[sortBy] < bug2[sortBy] ? -1 : 1

    if (sortDir === -1) {
        return -res
    }
    return res
}
