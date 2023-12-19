import { useState, useEffect, useContext } from 'react'
import { Formik, Form, useFormikContext } from 'formik'
import { authService } from '../../services/auth.service'
import { LoginContext } from '../../contexts/LoginContext'
import { useNavigate } from 'react-router'
import {
    loginValidation,
    signupValidation,
} from '../../validations/loginSignup.validation'
import { LoginSignupForm } from './LoginSignupForm'

export function LoginSignup({ isLogin }) {
    const { setLoggedinUser } = useContext(LoginContext)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    async function onSubmit(values, { setSubmitting }) {
        const { username, password, fullname } = values

        try {
            let user = undefined
            if (isLogin) {
                user = await authService.login({ username, password })
            } else {
                user = await authService.signup({
                    username,
                    password,
                    fullname,
                })
            }
            setLoggedinUser(user)
            setSubmitting(false)
            navigate('/bug')
        } catch (err) {
            console.error(err)
            setError(err.response.data.error)
        }
    }

    function getInitialDraft() {
        return { username: '', password: '', fullname: '' }
    }

    function getValidationSchema() {
        return isLogin ? loginValidation : signupValidation
    }

    return (
        <div className="login-signup">
            <h1>{isLogin ? 'Log in' : 'Sign up'}</h1>

            <Formik
                initialValues={getInitialDraft()}
                validationSchema={getValidationSchema()}
                onSubmit={onSubmit}
            >
                <LoginSignupForm
                    isLogin={isLogin}
                    error={error}
                    setError={setError}
                />
            </Formik>
        </div>
    )
}
