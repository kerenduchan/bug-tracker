export const utilAxiosService = {
    query,
    getById,
    save,
    remove,
}

async function query(
    axios,
    baseUrl,
    filter = {},
    sort = {},
    pageIdx,
    pageSize
) {
    const params = { ...filter, ...sort, pageIdx, pageSize }

    try {
        const { data } = await axios.get(baseUrl, { params })
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function getById(axios, baseUrl, id) {
    const url = baseUrl + id

    try {
        const { data } = await axios.get(url)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function save(axios, baseUrl, entity) {
    const method = entity._id ? 'put' : 'post'

    if (method === 'put') {
        baseUrl += entity._id
    }

    try {
        const { data } = await axios[method](baseUrl, entity)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}

async function remove(axios, baseUrl, id) {
    const url = baseUrl + id

    try {
        const { data } = await axios.delete(url)
        return data
    } catch (err) {
        console.error(err)
        console.error(err.response.data.error)
        throw err
    }
}
