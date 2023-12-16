import { useState, useEffect, useContext } from 'react'
import { useForm } from '../../customHooks/useForm'
import { authService } from '../../services/auth.service'
import { LoginContext } from '../../contexts/LoginContext'
import { useNavigate } from 'react-router'

export function LoginSignup({ isLogin }) {
    const { loggedinUser, setLoggedinUser } = useContext(LoginContext)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [draft, handleChange, setDraft] = useForm(getInitialDraft())

    useEffect(() => {
        // when switching between signup/login pages, reset draft
        setDraft(getInitialDraft())
    }, [isLogin])

    useEffect(() => {
        setError(null)
    }, [isLogin, draft])

    async function onSubmit(e) {
        e.preventDefault()
        try {
            let user = undefined
            if (isLogin) {
                user = await authService.login({
                    username: draft.username,
                    password: draft.password,
                })
            } else {
                user = await authService.signup(draft)
            }
            setLoggedinUser(user)
            navigate('/bug')
        } catch (err) {
            console.log(err)
            setError(err.response.data.error)
        }
    }

    function getInitialDraft() {
        return { username: '', password: '', fullname: '' }
    }

    return (
        <div className="login-signup">
            <h1>{isLogin ? 'Log in' : 'Sign up'}</h1>

            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    onChange={handleChange}
                    value={draft.username}
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    onChange={handleChange}
                    value={draft.password}
                />

                {!isLogin && (
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        placeholder="Full Name"
                        onChange={handleChange}
                        value={draft.fullname}
                    />
                )}

                <button className="btn-primary">
                    {isLogin ? 'Log in' : 'Sign up'}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}
