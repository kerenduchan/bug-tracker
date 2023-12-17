import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../../services/user.service'
import { LoginContext } from '../../contexts/LoginContext'
import { Icon } from '../general/Icon'

export function UserPreview({ user, onRemoveUser }) {
    const { loggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()

    function onEdit() {
        navigate(`/user/edit/${user._id}`)
    }

    function isEditAllowed() {
        return userService.isEditUserAllowed(loggedinUser, user)
    }

    function isDeleteAllowed() {
        return userService.isDeleteUserAllowed(loggedinUser, user)
    }

    return (
        <article className="user-preview">
            <h4 className="fullname">{user.fullname}</h4>
            <div className="username">{user.username}</div>
            <div className="score">{user.score}</div>
            <div className="bugs-count">{user.bugs.length}</div>

            <Link to={`/user/${user._id}`} />

            <div className="actions">
                {isEditAllowed() && (
                    <button className="btn-icon-round" onClick={onEdit}>
                        <Icon type="edit" />
                    </button>
                )}

                {isDeleteAllowed() && (
                    <button
                        className="btn-icon-round"
                        onClick={() => onRemoveUser(user._id)}
                    >
                        <Icon type="delete" />
                    </button>
                )}
            </div>
        </article>
    )
}
