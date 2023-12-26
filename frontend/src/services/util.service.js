import moment from 'moment'

export const utilService = {
    makeId,
    getSortDirOptions,
    saveToStorage,
    loadFromStorage,
    formatDateTimeFull,
    formatDateTime,
    parseSearchParams,
    buildSearchParams,
    getErrorMessage,
    simpleIsEqual,
}

function makeId(length = 6) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getSortDirOptions() {
    return _sortDirOptions
}
const _sortDirOptions = [
    { text: 'ascending', value: '1' },
    { text: 'descending', value: '-1' },
]

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
}

function formatDateTimeFull(timestamp) {
    const m = moment(timestamp)
    return `${m.format('DD/MM/YYYY [at] HH:mm')} (${m.fromNow()})`
}

function formatDateTime(timestamp) {
    return moment(timestamp).fromNow()
}

function buildSearchParams(view, defaultFilter, defaultSort) {
    const { filter, sort, curPageIdx, pageSize } = view

    const params = {}

    Object.keys(defaultFilter).forEach((key) => {
        if (filter[key] !== defaultFilter[key]) {
            params[key] = filter[key]
        }
    })

    Object.keys(defaultSort).forEach((key) => {
        if (sort[key] !== defaultSort[key]) {
            params[key] = sort[key]
        }
    })

    if (curPageIdx !== 0) {
        params.curPageIdx = curPageIdx
    }

    if (pageSize !== 5) {
        params.pageSize = pageSize
    }

    return params
}

function parseSearchParams(searchParams, defaultFilter, defaultSort) {
    const filter = {}
    Object.keys(defaultFilter).forEach((key) => {
        filter[key] = searchParams.get(key) || defaultFilter[key]
    })

    const sort = {}
    Object.keys(defaultSort).forEach((key) => {
        sort[key] = searchParams.get(key) || defaultSort[key]
    })

    const curPageIdx = +searchParams.get('curPageIdx') || 0
    const pageSize = +searchParams.get('pageSize') || 5

    return {
        filter,
        sort,
        curPageIdx,
        pageSize,
    }
}

function getErrorMessage(err) {
    const data = err?.response?.data
    if (!data) {
        return undefined
    }
    let res = data.error
    if (data.errors) {
        res += ': ' + Object.values(data.errors).join('. ')
    }
    return res
}

function simpleIsEqual(obj1, obj2) {
    const found = Object.keys(obj1).find((key) => obj1[key] !== obj2[key])
    return found === undefined
}
