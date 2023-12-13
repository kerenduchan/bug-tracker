import { userAxiosService } from './user.axios.service.js'

export const userService = {
    ...userAxiosService,
    getSortByOptions,
    getEmptyUser,
    getDefaultFilter,
    getDefaultSort,
    getSortByOptions,
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
    return { txt: '', minScore: 0 }
}

function getDefaultSort() {
    return {
        sortBy: 'fullname',
        sortDir: 'ascending',
    }
}

function getSortByOptions() {
    return _sortByOptions
}

const _sortByOptions = [
    { text: 'Full Name', value: 'fullname' },
    { text: 'Username', value: 'username' },
    { text: 'Score', value: 'score' },
]
