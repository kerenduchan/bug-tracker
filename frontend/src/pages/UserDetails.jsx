import { useContext, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useNavigate, useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext.js'
import { FieldList } from '../cmps/general/FieldList.jsx'
import { utilService } from '../services/util.service.js'
import { AreYouSureDialog } from '../cmps/general/AreYouSureDialog.jsx'

export function UserDetails() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { loggedinUser } = useContext(LoginContext)
    const [user, setUser] = useState(null)
    const { userId, viewType } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [])

    function onEdit() {
        navigate(`/user/edit/${user._id}`)
    }

    async function onDeleteConfirm() {
        setShowDeleteDialog(false)

        try {
            await userService.remove(userId)
            navigate('/user')
            showSuccessMsg('User deleted')
        } catch (err) {
            console.error('Error:', err)
            showErrorMsg(utilService.getErrorMessage(err))
        }
    }

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            showErrorMsg('Cannot load user')
        }
    }

    function isProfileView() {
        return viewType === 'profile'
    }

    function isViewAllowed() {
        return userService.isViewUserDetailsAllowed(loggedinUser, user)
    }

    function isEditAllowed() {
        return userService.isEditUserAllowed(loggedinUser, user)
    }

    function isDeleteAllowed() {
        return userService.isDeleteUserAllowed(loggedinUser, user)
    }

    function getBugsFieldValue() {
        return (
            <Link to={`/bug?creatorUsername=${user.username}`}>
                See bugs created by this user
            </Link>
        )
    }

    function getFields() {
        if (!user) return []

        return [
            { label: 'Full Name', value: user.fullname },
            { label: 'Username', value: user.username },
            { label: 'Score', value: user.score },
            { label: 'Role', value: user.isAdmin ? 'Administrator' : 'User' },
            {
                label: 'Bugs',
                value: getBugsFieldValue(),
            },
        ]
    }

    if (!user) return <h1>Loading....</h1>

    if (!isViewAllowed()) {
        return <h1>Not authorized</h1>
    }

    return (
        <div className="user-details">
            {!isProfileView() && (
                <div className="header">
                    <Link to="/user">Back to List</Link>
                </div>
            )}
            <div className="main">
                <h1>User {isProfileView() ? 'Profile' : 'Details'}</h1>
                <FieldList fields={getFields()} />
                <div className="actions">
                    {isEditAllowed() && (
                        <button
                            className="btn-primary btn-edit"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                    )}

                    {isDeleteAllowed() && (
                        <button
                            className="btn-secondary btn-delete"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete
                        </button>
                    )}
                </div>
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
        </div>
    )
}
