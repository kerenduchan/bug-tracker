import { useContext, useState } from 'react'
import { commentService } from '../../../services/comment.service'
import { LoginContext } from '../../../contexts/LoginContext'
import { BugComment } from './BugComment'
import { BugCommentCreateForm } from './BugCommentCreateForm'

export function BugComments({ comments, onCreateComment }) {
    const [showCreateCommentForm, setShowCreateCommentForm] = useState(false)
    const { loggedinUser } = useContext(LoginContext)

    function onCreateCommentInternal(txt) {
        onCreateComment(txt)
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
                    <BugCommentCreateForm
                        onCancel={() => setShowCreateCommentForm(false)}
                        onCreateComment={onCreateCommentInternal}
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
                        <BugComment comment={comment} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
