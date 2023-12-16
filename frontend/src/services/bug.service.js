// import { bugLocalService } from './bug.local.service.js'
import { bugAxiosService } from './bug.axios.service.js'

// switch this to bugLocalService for working with local storage
const service = bugAxiosService

export const bugService = {
    ...service,
    getSortByOptions,
    getEmptyBug,
    getDefaultFilter,
    getDefaultSort,
    getAllSeverities,
    parseSearchParams,
    buildSearchParams,
}

function getEmptyBug(title = '', severity = 5, description = '') {
    return { title, severity, description, labels: [], createdAt: null }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '1', labels: '', creatorUsername: '' }
}

function getDefaultSort() {
    return {
        sortBy: 'createdAt',
        sortDir: '1',
    }
}

function getSortByOptions() {
    return _sortByOptions
}

function getAllSeverities() {
    return _allSeverities
}

function buildSearchParams(filter, sort, curPageIdx, pageSize) {
    const params = {}

    const defaultFilter = getDefaultFilter()
    Object.keys(defaultFilter).forEach((key) => {
        if (filter[key] !== defaultFilter[key]) {
            params[key] = filter[key]
        }
    })

    const defaultSort = getDefaultSort()
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

function parseSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filter = {}
    Object.keys(defaultFilter).forEach((key) => {
        filter[key] = searchParams.get(key) || defaultFilter[key]
    })

    const defaultSort = getDefaultSort()
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

const _sortByOptions = [
    { text: 'Severity', value: 'severity' },
    { text: 'Description', value: 'description' },
    { text: 'Title', value: 'title' },
    { text: 'Creation Time', value: 'createdAt' },
]

const _allSeverities = ['1', '2', '3', '4', '5']
