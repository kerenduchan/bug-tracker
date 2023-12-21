import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'
import { utilAxiosService } from './util.axios.service'

export const bugAxiosService = {
    query,
    getById,
    remove,
    save,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = getBaseUrl() + 'bug/'

async function query(filter = {}, sort = {}, pageIdx, pageSize) {
    return utilAxiosService.query(
        axios,
        BASE_URL,
        filter,
        sort,
        pageIdx,
        pageSize
    )
}

async function getById(id) {
    return await utilAxiosService.getById(axios, BASE_URL, id)
}

async function remove(id) {
    return await utilAxiosService.remove(axios, BASE_URL, id)
}

async function save(entity) {
    // convert comma-separated labels string to array and sanitize the labels
    entity.labels = _sanitizeLabels(entity.labels.split(','))

    // convert severity to number
    entity.severity = +entity.severity

    return await utilAxiosService.save(axios, BASE_URL, entity)
}

function _sanitizeLabels(labels) {
    // trim the labels
    labels = labels.map((l) => l.trim())

    // remove duplicate labels and empty labels
    return [...new Set(labels)].filter((l) => l.length > 0)
}
