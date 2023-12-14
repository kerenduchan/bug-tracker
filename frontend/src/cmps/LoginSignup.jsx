export function LoginSignup({ isLogin }) {
    return <div className="login-signup">{isLogin ? 'login' : 'signup'}</div>
}
