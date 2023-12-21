import { commentAxiosService } from './comment.axios.service.js'

// switch this to bugLocalService for working with local storage
const service = commentAxiosService

export const commentService = {
    ...service,
    isCreateCommentAllowed,
    isEditOrDeleteCommentAllowed,
}

// a user is allowed to create a comment only if they are logged in
function isCreateCommentAllowed(loggedinUser) {
    return loggedinUser
}

// a user is allowed to edit/delete a comment only if they are logged in and
// they are an admin or they are the comment creator
function isEditOrDeleteCommentAllowed(loggedinUser, comment) {
    return (
        loggedinUser &&
        (loggedinUser.isAdmin || loggedinUser._id === comment.creator._id)
    )
}
