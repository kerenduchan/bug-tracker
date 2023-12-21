import Axios from 'axios'
import { getBaseUrl } from './base-url.axios.service'

export const commentAxiosService = {
    query,
    // getById,
    // remove,
    // save,
}

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = getBaseUrl() + 'comment/'

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
