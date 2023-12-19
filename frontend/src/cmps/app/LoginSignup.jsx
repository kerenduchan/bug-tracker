import { useState, useEffect, useContext } from 'react'
import { Formik, Form } from 'formik'
import { useForm } from '../../customHooks/useForm'
import { authService } from '../../services/auth.service'
import { LoginContext } from '../../contexts/LoginContext'
import { useNavigate } from 'react-router'
import {
    loginValidation,
    signupValidation,
} from '../../validations/loginSignup.validation'
import { TextInput } from '../general/form/TextInput'

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
            console.log(err)
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
                <Form>
                    <TextInput label="Username" name="username" type="text" />

                    <TextInput
                        label="Password"
                        name="password"
                        type="password"
                    />

                    {!isLogin && (
                        <TextInput
                            label="Full Name"
                            name="fullname"
                            type="text"
                        />
                    )}

                    <button className="btn-primary" type="submit">
                        {isLogin ? 'Log in' : 'Sign up'}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </Form>
            </Formik>
        </div>
    )
}
