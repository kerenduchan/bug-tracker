import { commentAxiosService } from './comment.axios.service.js'

// switch this to bugLocalService for working with local storage
const service = commentAxiosService

export const commentService = {
    ...service,
    isCreateCommentAllowed,
}

// a user is allowed to create a comment only if they are logged in
function isCreateCommentAllowed(loggedinUser) {
    return loggedinUser
}
