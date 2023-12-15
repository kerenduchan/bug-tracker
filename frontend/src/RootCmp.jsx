import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppHeader } from './cmps/app/AppHeader.jsx'
import { AppFooter } from './cmps/app/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { BugEdit } from './cmps/bug/BugEdit.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserEdit } from './cmps/user/UserEdit.jsx'
import { LoginContext } from './contexts/LoginContext'
import { LoginSignup } from './cmps/app/LoginSignup.jsx'
import { authService } from './services/auth.service.js'

export function App() {
    const [loggedinUser, setLoggedinUser] = useState(
        authService.getLoggedinUser()
    )

    return (
        <LoginContext.Provider value={{ loggedinUser, setLoggedinUser }}>
            <Router>
                <div className="app">
                    <AppHeader />
                    <main className="app-main">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/login"
                                element={<LoginSignup isLogin={true} />}
                            />
                            <Route
                                path="/signup"
                                element={<LoginSignup isLogin={false} />}
                            />

                            <Route path="/bug" element={<BugIndex />} />
                            <Route
                                path="/bug/:bugId"
                                element={<BugDetails />}
                            />
                            <Route
                                path="/bug/edit/:bugId?"
                                element={<BugEdit />}
                            />

                            <Route path="/user" element={<UserIndex />} />
                            <Route
                                path="/user/:userId"
                                element={<UserDetails />}
                            />
                            <Route
                                path="/user/edit/:userId?"
                                element={<UserEdit />}
                            />
                        </Routes>
                    </main>
                    <AppFooter />
                </div>
            </Router>
        </LoginContext.Provider>
    )
}
