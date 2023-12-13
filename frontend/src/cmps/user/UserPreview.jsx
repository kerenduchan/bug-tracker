import { Link } from 'react-router-dom'

export function UserPreview({ user, onRemoveUser, onEditUser }) {
    return (
        <article className="user-preview">
            <h4 className="fullname">{user.fullname}</h4>
            <div className="username">{user.username}</div>
            <div className="score">{user.score}</div>

            <Link to={`/user/${user._id}`} />
            <div className="actions">
                <button
                    className="btn-delete"
                    onClick={() => onRemoveUser(user._id)}
                >
                    Delete
                </button>
                <button className="btn-edit" onClick={() => onEditUser(user)}>
                    Edit
                </button>
            </div>
        </article>
    )
}
