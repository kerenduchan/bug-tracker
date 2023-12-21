import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'

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
    const params = { ...filter, ...sort, pageIdx, pageSize }

    try {
        const { data } = await axios.get(BASE_URL, { params })
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function getById(id) {
    const url = BASE_URL + id

    try {
        const { data } = await axios.get(url)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function remove(id) {
    const url = BASE_URL + id

    try {
        const { data } = await axios.delete(url)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function save(entity) {
    // convert comma-separated labels string to array and sanitize the labels
    entity.labels = _sanitizeLabels(entity.labels.split(','))

    // convert severity to number
    entity.severity = +entity.severity

    const method = entity._id ? 'put' : 'post'

    try {
        const { data } = await axios[method](BASE_URL, entity)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

function _sanitizeLabels(labels) {
    // trim the labels
    labels = labels.map((l) => l.trim())

    // remove duplicate labels and empty labels
    return [...new Set(labels)].filter((l) => l.length > 0)
}
