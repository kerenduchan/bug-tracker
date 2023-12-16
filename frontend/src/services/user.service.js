import { userAxiosService } from './user.axios.service.js'
import { utilService } from './util.service.js'

export const userService = {
    ...userAxiosService,
    getSortByOptions,
    getEmptyUser,
    getDefaultFilter,
    getDefaultSort,
    getSortByOptions,
    buildSearchParams,
    parseSearchParams,
}

function getEmptyUser(
    fullname = '',
    username = '',
    password = '',
    score = 100
) {
    return { fullname, username, password, score }
}

function getDefaultFilter() {
    return { txt: '', minScore: '0' }
}

function getDefaultSort() {
    return {
        sortBy: 'fullname',
        sortDir: '1',
    }
}

function getSortByOptions() {
    return _sortByOptions
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

const _sortByOptions = [
    { text: 'Full Name', value: 'fullname' },
    { text: 'Username', value: 'username' },
    { text: 'Score', value: 'score' },
]
