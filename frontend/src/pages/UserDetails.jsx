import { useContext, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext.js'

export function UserDetails() {
    const { loggedinUser } = useContext(LoginContext)
    const [user, setUser] = useState(null)
    const { userId } = useParams()

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

    function isAuthorized() {
        return loggedinUser?.isAdmin
    }

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    if (!user) return <h1>Loading....</h1>

    return (
        <div className="user-details">
            <div className="header">
                <Link to="/user">Back to List</Link>
            </div>
            <div className="main">
                <h1>User Details</h1>
                <div className="fields">
                    <div className="label">Full Name:</div>
                    <div className="fullname">{user.fullname}</div>

                    <div className="label">Username:</div>
                    <div className="fullname">{user.username}</div>

                    <div className="label">Score:</div>
                    <div className="fullname">{user.score}</div>

                    <div className="label">Bugs:</div>
                    <div className="fullname">
                        <Link to={`/bug?creatorUsername=${user.username}`}>
                            See all bugs created by this user
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
