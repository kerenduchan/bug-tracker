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
    const { data: res } = await axios.get(BASE_URL, { params })
    return res
}

async function getById(id) {
    const url = BASE_URL + id

    var { data } = await axios.get(url)
    return data
}

async function remove(id) {
    const url = BASE_URL + id
    var { data } = await axios.delete(url)
    return data
}

async function save(entity) {
    // convert comma-separated labels string to array and trim the labels
    entity.labels = entity.labels.split(',').map((l) => l.trim())

    // remove duplicate labels and empty labels
    entity.labels = [...new Set(entity.labels)].filter((l) => l.length > 0)

    const method = entity._id ? 'put' : 'post'
    const { data } = await axios[method](BASE_URL, entity)
    return data
}
