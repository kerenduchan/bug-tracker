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
    isViewUserListAllowed,
    isViewUserDetailsAllowed,
    isEditUserAllowed,
    isCreateUserAllowed,
    isDeleteUserAllowed,
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
    return { txt: '', minScore: '' }
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

// a user is allowed to view the list of users only if they are logged in, and
// they are an admin
function isViewUserListAllowed(loggedinUser) {
    return loggedinUser && loggedinUser.isAdmin
}

// a user is allowed to view a user only if they are logged in, and they
// are either an admin or they are the user themselves
function isViewUserDetailsAllowed(loggedinUser, user) {
    return (
        loggedinUser && (loggedinUser.isAdmin || loggedinUser._id === user._id)
    )
}

// a user is allowed to edit a user only if they are logged in and they are an
// admin
function isEditUserAllowed(loggedinUser, user) {
    return loggedinUser && loggedinUser.isAdmin
}

// a user is allowed to create a user only if they are logged in and they are an
// admin
function isCreateUserAllowed(loggedinUser) {
    return loggedinUser && loggedinUser.isAdmin
}

// a user is allowed to delete a user only if they are logged in and they are an
// admin, and the user has no bugs, and the user is not attempting to delete
// themselves. The no bugs check is not done on the client side.
function isDeleteUserAllowed(loggedinUser, user) {
    return loggedinUser && loggedinUser.isAdmin && loggedinUser._id !== user._id
}

const _sortByOptions = [
    { text: 'Full Name', value: 'fullname' },
    { text: 'Username', value: 'username' },
    { text: 'Score', value: 'score' },
]
