import fs from 'fs'
import http from 'http'
import https from 'https'
import { loggerService } from './logger.service.js'

export const utilService = {
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
    validateMandatoryFields,
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

function remove(entityType, id, objs, filename) {
    try {
        const idx = objs.findIndex((obj) => obj._id === id)
        if (idx === -1) throw `Couldn't find ${entityType} with ID ${id}`
        objs.splice(idx, 1)
        writeJsonFile(filename, objs)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function getById(entityType, id, objs) {
    try {
        var obj = objs.find((o) => o._id === id)
        if (!obj) throw `Couldn't find ${entityType} with ID ${id}`
        return obj
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function create(obj, processFields, objs, path) {
    obj = await processFields(obj, true)
    try {
        const newObj = {
            _id: makeId(),
            createdAt: Date.now(),
            ...obj,
        }

        // save to "DB"
        objs.push(newObj)
        writeJsonFile(path, objs)
        return newObj
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(entityType, obj, validateFields, objs, path) {
    try {
        // strict fields
        const fieldsToUpdate = await validateFields(obj, false)

        // fetch by ID from "DB"
        var idx = objs.findIndex((o) => o._id === obj._id)
        if (idx === -1) throw `Couldn't find ${entityType} with ID ${obj._id}`
        const dbObj = objs[idx]

        // update only the supplied fields
        const updatedObj = { ...dbObj, ...fieldsToUpdate }

        // save to "DB"
        objs.splice(idx, 1, updatedObj)
        writeJsonFile(path, objs)
        return updatedObj
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function query(
    objs,
    isMatchFilter,
    filterBy,
    sortBy,
    sortDir,
    pageIdx = undefined,
    pageSize = 5
) {
    try {
        // filter
        let res = objs.filter((o) => isMatchFilter(o, filterBy))

        // total count after filtering
        const totalCount = res.length

        // sort
        if (sortBy) {
            res = res.sort((o1, o2) => _compare(o1, o2, sortBy, sortDir))
        }

        // pagination
        if (pageIdx !== undefined) {
            const firstIdx = pageIdx * pageSize
            const endIdx = firstIdx + pageSize
            res = res.slice(firstIdx, endIdx)
        }

        return {
            data: res,
            totalCount,
        }
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

function _compare(bug1, bug2, sortBy, sortDir = 1) {
    const res = bug1[sortBy] < bug2[sortBy] ? -1 : 1

    if (sortDir === -1) {
        return -res
    }
    return res
}
