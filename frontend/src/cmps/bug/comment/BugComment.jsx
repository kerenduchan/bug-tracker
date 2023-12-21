import { useContext } from 'react'
import { commentService } from '../../../services/comment.service'
import { utilService } from '../../../services/util.service'
import { LoginContext } from '../../../contexts/LoginContext'

export function BugComment({ comment, onDelete }) {
    const { loggedinUser } = useContext(LoginContext)

    function onEdit() {
        console.log('on edit')
    }

    function isActionsAllowed() {
        return commentService.isEditOrDeleteCommentAllowed(
            loggedinUser,
            comment
        )
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
            {isActionsAllowed() && (
                <div className="bug-comment-actions">
                    <div className="bug-comment-action" onClick={onEdit}>
                        Edit
                    </div>
                    <div className="bug-comment-action" onClick={onDelete}>
                        Delete
                    </div>
                </div>
            )}
        </div>
    )
}
