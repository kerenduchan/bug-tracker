import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'

export const userAxiosService = {
    query,
    getById,
    remove,
    save,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = getBaseUrl() + 'user/'

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
    const method = entity._id ? 'put' : 'post'

    // convert score to number
    entity.score = +entity.score

    // don't send password if empty
    if (entity.password === '') {
        delete entity.password
    }

    try {
        const { data } = await axios[method](BASE_URL, entity)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}
