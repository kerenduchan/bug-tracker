import { utilService } from '../../../services/util.service'

export function BugComment({ comment }) {
    return (
        <div className="bug-comment">
            <div className="created-at">
                {utilService.formatDateTime(comment.createdAt)}
            </div>
            <div className="created-by">{comment.creator.fullname}</div>
            <div className="txt">{comment.txt}</div>
        </div>
    )
}
