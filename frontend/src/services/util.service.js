import moment from 'moment'

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getSortDirOptions,
    saveToStorage,
    loadFromStorage,
    formatDateTime,
    parseSearchParams,
    buildSearchParams,
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

function makeLorem(size = 100) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        '.',
        'All',
        'this happened',
        'more or less',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ]
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
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

function formatDateTime(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY hh:mm')
}

function buildSearchParams(
    filter,
    sort,
    curPageIdx,
    pageSize,
    defaultFilter,
    defaultSort
) {
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
