import fs from 'fs'
import http from 'http'
import https from 'https'
import { ObjectId } from 'mongodb'

export const utilService = {
    createObjectId,
    toNumber,
    validateMandatoryFields,
    extractFields,
    validateStringLength,
    validateNumber,
    removeNullAndUndefined,
}

function createObjectId(id) {
    try {
        return new ObjectId(id)
    } catch (err) {
        throw `Invalid ID: ${id}`
    }
}

function toNumber(s) {
    if (s === undefined || s === null || s === '') {
        return undefined
    }
    s = +s
    if (isNaN(s)) {
        return undefined
    }
    return s
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

function removeNullAndUndefined(obj) {
    let res = {}
    for (let field in obj) {
        if (obj[field] !== null && obj[field] !== undefined) {
            res[field] = obj[field]
        }
    }
    return res
}
