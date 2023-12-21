import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'
import { utilAxiosService } from './util.axios.service'

export const commentAxiosService = {
    query,
    getById,
    save,
    remove,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = getBaseUrl() + 'comment/'

async function query(filter = {}, sort = {}, pageIdx, pageSize) {
    return await utilAxiosService.query(
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
    return await utilAxiosService.save(axios, BASE_URL, entity)
}

async function remove(id) {
    return await utilAxiosService.remove(axios, BASE_URL, id)
}
