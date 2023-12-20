import mongoDB from 'mongodb'
const { MongoClient } = mongoDB

import { dbConfig } from '../dbConfig/dbConfig.js'
import { loggerService } from './logger.service.js'

export const dbService = {
    getCollection,
}

var dbConn = null

// get a collection in the bug-tracker db (bug, user)
async function getCollection(collectionName) {
    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        loggerService.error(
            `Failed to get ${collectionName} db collection`,
            err
        )
        throw err
    }
}

// connect to the bug-tracker db only once
async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(dbConfig.dbURL)
        dbConn = client.db(dbConfig.dbName)
        return dbConn
    } catch (err) {
        loggerService.error('Cannot Connect to DB', err)
        throw err
    }
}
