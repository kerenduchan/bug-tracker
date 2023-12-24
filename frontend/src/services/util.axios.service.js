export const utilAxiosService = {
    query,
    getById,
    save,
    remove,
    getErrorMessage,
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
        handleAxiosError(err)
    }
}

async function getById(axios, baseUrl, id) {
    const url = baseUrl + id

    try {
        const { data } = await axios.get(url)
        return data
    } catch (err) {
        handleAxiosError(err)
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
        handleAxiosError(err)
    }
}

function handleAxiosError(err) {
    console.error(err)
    console.error(getErrorMessage(err))
    throw err
}

function getErrorMessage(err) {
    const errorObj = err.response.data?.error
    if (!errorObj) {
        return undefined
    }
    let res = errorObj.error
    if (errorObj.errors) {
        res += ': ' + Object.values(errorObj.errors).join('. ')
    }
    return res
}

async function remove(axios, baseUrl, id) {
    const url = baseUrl + id

    try {
        const { data } = await axios.delete(url)
        return data
    } catch (err) {
        handleAxiosError(err)
    }
}
