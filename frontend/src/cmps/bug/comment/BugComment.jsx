import { utilService } from '../../../services/util.service'

export function BugComment({ comment, onDelete }) {
    function onEdit() {
        console.log('on edit')
    }

    return (
        <div className="bug-comment">
            <div className="created-at">
                {utilService.formatDateTime(comment.createdAt)}
            </div>
            <div className="created-by">{comment.creator.fullname}</div>
            <div className="txt">
                <pre>{comment.txt}</pre>
            </div>
            <div className="bug-comment-actions">
                <div className="bug-comment-action" onClick={onEdit}>
                    Edit
                </div>
                <div className="bug-comment-action" onClick={onDelete}>
                    Delete
                </div>
            </div>
        </div>
    )
}
