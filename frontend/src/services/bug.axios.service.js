import Axios from 'axios'

export const bugAxiosService = {
    query,
    getById,
    remove,
    save,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/bug/'

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
    const method = entity._id ? 'put' : 'post'
    const { data } = await axios[method](BASE_URL, entity)
    return data
}
