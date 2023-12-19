import { useContext, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useNavigate, useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext.js'
import { FieldList } from '../cmps/general/FieldList.jsx'

export function UserDetails() {
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

    async function onDelete() {
        try {
            await userService.remove(userId)
            navigate('/user')
            showSuccessMsg('User deleted')
        } catch (err) {
            console.error('Error:', err)
            showErrorMsg('Failed to delete user')
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
        return user.bugs.length ? (
            <Link to={`/bug?creatorUsername=${user.username}`}>
                {user.bugs.length}
            </Link>
        ) : (
            0
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
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
