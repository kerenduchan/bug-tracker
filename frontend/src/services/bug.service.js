// import { bugLocalService } from './bug.local.service.js'
import { bugAxiosService } from './bug.axios.service.js'
import { utilService } from './util.service.js'

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
    isDeleteOrEditBugAllowed,
    isCreateBugAllowed,
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
        sortDir: '-1',
    }
}

function getSortByOptions() {
    return _sortByOptions
}

function getAllSeverities() {
    return _allSeverities
}

function buildSearchParams(filter, sort, curPageIdx, pageSize) {
    return utilService.buildSearchParams(
        filter,
        sort,
        curPageIdx,
        pageSize,
        getDefaultFilter(),
        getDefaultSort()
    )
}

function parseSearchParams(searchParams) {
    return utilService.parseSearchParams(
        searchParams,
        getDefaultFilter(),
        getDefaultSort()
    )
}

// a user is allowed to delete/edit a bug only if they are logged in, and they
// are either an admin or the bug creator
function isDeleteOrEditBugAllowed(loggedinUser, bug) {
    return (
        loggedinUser &&
        (loggedinUser.isAdmin || loggedinUser._id === bug.creator._id)
    )
}

// a user is allowed to create a bug only if they are logged in
function isCreateBugAllowed(loggedinUser) {
    return loggedinUser
}

const _sortByOptions = [
    { text: 'Severity', value: 'severity' },
    { text: 'Description', value: 'description' },
    { text: 'Title', value: 'title' },
    { text: 'Creation Time', value: 'createdAt' },
]

const _allSeverities = ['1', '2', '3', '4', '5']
