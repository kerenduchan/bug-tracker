import { useContext, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext.js'
import { FieldList } from '../cmps/general/FieldList.jsx'

export function UserDetails() {
    const { loggedinUser } = useContext(LoginContext)
    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const params = useParams()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            showErrorMsg('Cannot load user')
        }
    }

    function isProfileView() {
        return params.viewType === 'profile'
    }

    function isAuthorized() {
        if (!loggedinUser) {
            return false
        }
        if (loggedinUser.isAdmin) {
            return true
        }

        return isProfileView() && loggedinUser._id === userId
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
                value: (
                    <Link to={`/bug?creatorUsername=${user.username}`}>
                        See all the bugs{' '}
                        {isProfileView()
                            ? 'you created'
                            : 'created by this user'}
                    </Link>
                ),
            },
        ]
    }

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    if (!user) return <h1>Loading....</h1>

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
            </div>
        </div>
    )
}
