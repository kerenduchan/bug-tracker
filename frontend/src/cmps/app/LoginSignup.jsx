import { useForm } from '../../customHooks/useForm'

export function LoginSignup({ isLogin }) {
    const [draft, handleChange] = useForm(getInitialDraft())

    function onSubmit(e) {
        e.preventDefault()
    }

    function getInitialDraft() {
        let initialDraft = { username: '', password: '' }
        if (!isLogin) {
            initialDraft.fullname = ''
        }
        return initialDraft
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
                    onChange={handleChange}
                    value={draft.username}
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
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
            </form>
        </div>
    )
}
