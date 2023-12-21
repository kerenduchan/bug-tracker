import { BugComment } from './BugComment'

export function BugComments({ comments }) {
    return (
        <div className="bug-comments">
            <h2>Comments</h2>
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <BugComment comment={comment} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
