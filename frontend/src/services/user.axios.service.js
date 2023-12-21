import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'
import { utilAxiosService } from './util.axios.service'

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

async function save(entity) {
    // convert score to number
    entity.score = +entity.score

    // don't send password if empty
    if (entity.password === '') {
        delete entity.password
    }

    return await utilAxiosService.save(axios, BASE_URL, entity)
}

async function remove(id) {
    return await utilAxiosService.remove(axios, BASE_URL, id)
}
