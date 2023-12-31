import { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contexts/LoginContext'
import { UserMsg } from '../general/UserMsg'
import { authService } from '../../services/auth.service'

export function AppHeader() {
    const { loggedinUser, setLoggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()

    let navlinks = [
        { to: '/', text: 'Home' },
        { to: '/bug', text: 'Bugs' },
    ]

    if (loggedinUser && loggedinUser.isAdmin) {
        navlinks.push({ to: '/user', text: 'Users' })
    }

    async function onLogout() {
        try {
            await authService.logout()
            setLoggedinUser(null)
            navigate('/login')
        } catch (err) {}
    }

    return (
        <header className="app-header ">
            <UserMsg />
            <div className="header-container">
                <nav className="app-nav">
                    {navlinks.map((navlink) => (
                        <NavLink
                            className="navlink"
                            key={navlink.to}
                            to={navlink.to}
                        >
                            {navlink.text}
                        </NavLink>
                    ))}
                </nav>

                {loggedinUser ? (
                    <div className="logout-container">
                        <div className="loggedin-user">
                            Hi,{' '}
                            <Link
                                className="inverse"
                                to={`/user/${loggedinUser._id}/profile`}
                            >
                                {loggedinUser.fullname}
                            </Link>
                            !
                        </div>
                        <a className="logout inverse" onClick={onLogout}>
                            Log out
                        </a>
                    </div>
                ) : (
                    <div className="login-signup-container">
                        <NavLink className="navlink" to="/login">
                            Log in
                        </NavLink>
                        <NavLink className="navlink signup-link" to="/signup">
                            Sign up
                        </NavLink>
                    </div>
                )}
            </div>
        </header>
    )
}
