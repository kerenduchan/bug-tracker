import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { userService } from '../services/user.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
    createUserValidation,
    editUserValidation,
} from '../validations/user.validation'
import { LoginContext } from '../contexts/LoginContext'
import { FormikInput } from '../cmps/general/formik/FormikInput'

export function UserEdit() {
    const { loggedinUser } = useContext(LoginContext)
    const [initialValues, setInitialValues] = useState()
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        if (!userId) {
            const emptyUser = userService.getEmptyUser()
            setInitialValues(emptyUser)
            return
        }
        try {
            const user = await userService.getById(userId)
            setInitialValues({ ...user, password: '' })
        } catch (err) {
            console.error(err)
            showErrorMsg(err.response.data)
        }
    }

    async function onSubmit(values, { setSubmitting }) {
        try {
            await userService.save(values)
            showSuccessMsg(`User ${userId ? 'updated' : 'created'}`)
        } catch (err) {
            showErrorMsg(`Failed to ${userId ? 'update' : 'create'} user`)
        }
        setSubmitting(false)
        navigate('/user')
    }

    function onCancel() {
        navigate('/user')
    }

    function getValidationSchema() {
        return userId ? editUserValidation : createUserValidation
    }

    function isAuthorized() {
        if (userId) {
            // edit user
            return userService.isEditUserAllowed(loggedinUser, initialValues)
        }
        // create user
        return userService.isCreateUserAllowed(loggedinUser)
    }

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    if (!initialValues) return <h1>loading....</h1>
    return (
        <div className="user-edit">
            <div className="header">
                <Link to="/user">Back to List</Link>
            </div>
            <div className="main">
                <h1>{userId ? 'Edit' : 'Create'} User</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={getValidationSchema()}
                    onSubmit={onSubmit}
                >
                    {({ isValid }) => (
                        <Form>
                            <FormikInput
                                label="Full Name"
                                name="fullname"
                                type="text"
                            />

                            <FormikInput
                                label="Username"
                                name="username"
                                type="text"
                            />

                            <FormikInput
                                label="Password"
                                name="password"
                                type="password"
                            />
                            <FormikInput
                                label="Score"
                                name="score"
                                type="text"
                            />

                            <div className="actions">
                                <button
                                    className="btn-primary"
                                    disabled={!isValid}
                                    type="submit"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
