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
}

function getEmptyBug(title = '', severity = 5, description = '') {
    return { title, severity, description, labels: [], createdAt: null }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 1, labels: '', creatorUsername: '' }
}

function getDefaultSort() {
    return {
        sortBy: 'createdAt',
        sortDir: 'ascending',
    }
}

function getSortByOptions() {
    return _sortByOptions
}

function getAllSeverities() {
    return _allSeverities
}

const _sortByOptions = [
    { text: 'Severity', value: 'severity' },
    { text: 'Description', value: 'description' },
    { text: 'Title', value: 'title' },
    { text: 'Creation Time', value: 'createdAt' },
]

const _allSeverities = [1, 2, 3, 4, 5]
