import { useContext, useState } from 'react'
import { commentService } from '../../../services/comment.service'
import { LoginContext } from '../../../contexts/LoginContext'
import { BugComment } from './BugComment'
import { BugCommentEdit } from './BugCommentEdit'

export function BugComments({ comments, onCreate, onDelete, onEdit }) {
    const [showCreateCommentForm, setShowCreateCommentForm] = useState(false)
    const { loggedinUser } = useContext(LoginContext)

    function onCreateInternal(txt) {
        onCreate(txt)
        setShowCreateCommentForm(false)
    }

    function isCreateCommentAllowed() {
        return commentService.isCreateCommentAllowed(loggedinUser)
    }
    return (
        <div className="bug-comments">
            <h2>Comments</h2>

            {isCreateCommentAllowed() &&
                (showCreateCommentForm ? (
                    <BugCommentEdit
                        onCancel={() => setShowCreateCommentForm(false)}
                        onSave={onCreateInternal}
                    />
                ) : (
                    <button
                        className="btn-create-comment"
                        onClick={() => setShowCreateCommentForm(true)}
                    >
                        Write a comment...
                    </button>
                ))}

            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <BugComment
                            comment={comment}
                            onDelete={() => onDelete(comment._id)}
                            onEdit={onEdit}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
