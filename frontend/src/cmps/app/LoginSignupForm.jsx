import { useEffect } from 'react'
import { Form, useFormikContext } from 'formik'
import { FormikInput } from '../general/formik/FormikInput'

// need this separate component in order to reset form between signup/login
// through useEffect
export function LoginSignupForm({ isLogin, error, setError, isValid }) {
    const { resetForm } = useFormikContext()

    useEffect(() => {
        // when switching between signup/login pages, reset the form
        resetForm()
        setError(null)
    }, [isLogin])

    return (
        <Form>
            <FormikInput
                label="Username"
                name="username"
                type="text"
                required
            />

            <FormikInput
                label="Password"
                name="password"
                type="password"
                required={!isLogin}
            />

            {!isLogin && (
                <FormikInput
                    label="Full Name"
                    name="fullname"
                    type="text"
                    required
                />
            )}

            <button className="btn-primary" type="submit" disabled={!isValid}>
                {isLogin ? 'Log in' : 'Sign up'}
            </button>
            {error && <div className="error-msg">{error}</div>}
        </Form>
    )
}
