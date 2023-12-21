import { useState } from 'react'
import { BugComment } from './BugComment'
import { CreateCommentForm } from './CreateCommentForm'

export function BugComments({ comments, onCreateComment }) {
    const [showCreateCommentForm, setShowCreateCommentForm] = useState(false)

    function onCreateCommentInternal(txt) {
        onCreateComment(txt)
        setShowCreateCommentForm(false)
    }

    return (
        <div className="bug-comments">
            <h2>Comments</h2>

            {showCreateCommentForm ? (
                <CreateCommentForm
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
            )}
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
