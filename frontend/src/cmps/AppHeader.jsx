import { UserMsg } from './general/UserMsg'
import { NavLink } from 'react-router-dom'

export function AppHeader() {
    const navlinks = [
        { to: '/', text: 'Home' },
        { to: '/bug', text: 'Bugs' },
        { to: '/user', text: 'Users' },
    ]

    return (
        <header className="app-header ">
            <div className="header-container">
                <UserMsg />
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
            </div>
        </header>
    )
}
