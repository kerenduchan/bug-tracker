import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContext'
import { UserMsg } from './general/UserMsg'

export function AppHeader() {
    const { loggedinUser, setLoggedinUser } = useContext(LoginContext)

    const navlinks = [
        { to: '/', text: 'Home' },
        { to: '/bug', text: 'Bugs' },
        { to: '/user', text: 'Users' },
    ]

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
                    <div>Welcome</div>
                ) : (
                    <div className="login-signup-container">
                        <div className="login-link">Log in</div>
                        <div className="signup-link">Sign up</div>
                    </div>
                )}
            </div>
        </header>
    )
}
