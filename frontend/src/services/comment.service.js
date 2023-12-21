import { commentAxiosService } from './comment.axios.service.js'

// switch this to bugLocalService for working with local storage
const service = commentAxiosService

export const commentService = {
    ...service,
}
