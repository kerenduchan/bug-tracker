import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../general/Icon'

export function UserPreview({ user, onRemoveUser }) {
    const navigate = useNavigate()

    function onEdit() {
        navigate(`/user/edit/${user._id}`)
    }

    return (
        <article className="user-preview">
            <h4 className="fullname">{user.fullname}</h4>
            <div className="username">{user.username}</div>
            <div className="score">{user.score}</div>
            <div className="bugs-count">{user.bugs.length}</div>

            <Link to={`/user/${user._id}`} />

            <div className="actions">
                <button
                    className="btn-icon-round"
                    onClick={() => onRemoveUser(user._id)}
                >
                    <Icon type="delete" />
                </button>
                <button className="btn-icon-round" onClick={onEdit}>
                    <Icon type="edit" />
                </button>
            </div>
        </article>
    )
}
