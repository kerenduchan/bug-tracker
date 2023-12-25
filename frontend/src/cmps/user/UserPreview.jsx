import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../../services/user.service'
import { LoginContext } from '../../contexts/LoginContext'
import { Icon } from '../general/Icon'
import { AreYouSureDialog } from '../general/AreYouSureDialog'

export function UserPreview({ user, onRemoveUser }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { loggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()

    function onEdit() {
        navigate(`/user/edit/${user._id}`)
    }

    async function onDeleteConfirm() {
        setShowDeleteDialog(false)
        onRemoveUser(user._id)
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
            <div className="bug-count">{user.bugCount}</div>
            <div className="comment-count">{user.commentCount}</div>

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
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Icon type="delete" />
                    </button>
                )}
            </div>
            {showDeleteDialog && (
                <AreYouSureDialog
                    title="Delete User?"
                    text="This cannot be undone."
                    confirmText="Delete"
                    onConfirm={onDeleteConfirm}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </article>
    )
}
