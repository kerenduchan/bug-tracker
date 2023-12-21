import { useContext, useState } from 'react'
import { commentService } from '../../../services/comment.service'
import { utilService } from '../../../services/util.service'
import { LoginContext } from '../../../contexts/LoginContext'
import { BugCommentEdit } from './BugCommentEdit'

export function BugComment({ comment, onDelete, onEdit }) {
    const [showEditCommentForm, setShowEditCommentForm] = useState(false)
    const { loggedinUser } = useContext(LoginContext)

    function isActionsAllowed() {
        return commentService.isEditOrDeleteCommentAllowed(
            loggedinUser,
            comment
        )
    }

    function onSave(comment) {
        setShowEditCommentForm(false)
        onEdit(comment)
    }

    if (showEditCommentForm)
        return (
            <BugCommentEdit
                comment={comment}
                onCancel={() => setShowEditCommentForm(false)}
                onSave={onSave}
            />
        )

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
                    <div
                        className="bug-comment-action"
                        onClick={() => setShowEditCommentForm(true)}
                    >
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
