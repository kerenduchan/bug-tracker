import { useContext, useState } from 'react'
import { commentService } from '../../../services/comment.service'
import { utilService } from '../../../services/util.service'
import { LoginContext } from '../../../contexts/LoginContext'
import { BugCommentEdit } from './BugCommentEdit'
import { AreYouSureDialog } from '../../general/AreYouSureDialog'

export function BugComment({ comment, onDelete, onEdit }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditCommentForm, setShowEditCommentForm] = useState(false)
    const { loggedinUser } = useContext(LoginContext)

    function isActionsAllowed() {
        return commentService.isEditOrDeleteCommentAllowed(
            loggedinUser,
            comment
        )
    }

    async function onDeleteConfirm() {
        setShowDeleteDialog(false)
        onDelete()
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
                <pre>{comment.text}</pre>
            </div>
            {isActionsAllowed() && (
                <div className="bug-comment-actions">
                    <div
                        className="bug-comment-action"
                        onClick={() => setShowEditCommentForm(true)}
                    >
                        Edit
                    </div>
                    <div
                        className="bug-comment-action"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Delete
                    </div>
                </div>
            )}
            {showDeleteDialog && (
                <AreYouSureDialog
                    title="Delete Comment?"
                    text="This cannot be undone."
                    confirmText="Delete"
                    onConfirm={onDeleteConfirm}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </div>
    )
}
