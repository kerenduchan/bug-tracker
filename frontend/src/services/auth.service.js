import { authAxiosService } from './auth.axios.service'

export const authService = {
    ...authAxiosService,
    isDeleteOrEditBugAllowed,
}

// a user is allowed to delete/edit a bug only if they are logged in, and they
// are either an admin or the bug creator
function isDeleteOrEditBugAllowed(loggedinUser, bug) {
    return (
        loggedinUser &&
        (loggedinUser.isAdmin || loggedinUser._id === bug.creatorId)
    )
}
