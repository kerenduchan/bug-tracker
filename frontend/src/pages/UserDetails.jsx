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
        <div className="user-details main-layout">
            <h3>User Details</h3>
            <h4>{user.fullname}</h4>
            <p>
                Username: <span>{user.username}</span>
            </p>
            <p>
                Score: <span>{user.score}</span>
            </p>
            <Link to="/user">Back to List</Link>
        </div>
    )
}
