import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { bugService } from '../services/bug.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { LoginContext } from '../contexts/LoginContext'
import { FormikSelect } from '../cmps/general/formik/FormikSelect'
import { FormikTextArea } from '../cmps/general/formik/FormikTextArea'
import { bugValidation } from '../validations/bug.validation'
import { FormikInput } from '../cmps/general/formik/FormikInput'

export function BugEdit() {
    const { loggedinUser } = useContext(LoginContext)

    const [initialValues, setInitialValues] = useState()
    const { bugId } = useParams()
    const navigate = useNavigate()

    const severityOptions = bugService.getAllSeverities().map((s) => ({
        text: `${s}`,
        value: s,
    }))

    useEffect(() => {
        if (!loggedinUser) {
            navigate('/login', { replace: true })
            return
        }
        loadBug()
    }, [])

    async function loadBug() {
        if (!bugId) {
            const emptyBug = bugService.getEmptyBug()
            setInitialValues({ ...emptyBug, labels: '' })
            return
        }
        try {
            const bugToEdit = await bugService.getById(bugId)
            setInitialValues({
                ...bugToEdit,
                labels: bugToEdit.labels.join(','),
            })
        } catch (err) {
            console.error(err)
            showErrorMsg(err.response.data)
        }
    }

    async function onSubmit(values, { setSubmitting }) {
        try {
            await bugService.save(values)
            showSuccessMsg(`Bug ${bugId ? 'updated' : 'created'}`)
        } catch (err) {
            showErrorMsg(`Failed to ${bugId ? 'update' : 'create'} bug`)
        }
        setSubmitting(false)
        navigate('/bug')
    }

    function onCancel() {
        navigate('/bug')
    }

    function isAuthorized() {
        if (bugId) {
            // edit bug
            return bugService.isDeleteOrEditBugAllowed(
                loggedinUser,
                initialValues
            )
        }
        // create bug
        return bugService.isCreateBugAllowed(loggedinUser)
    }

    if (!initialValues) return <h1>loading....</h1>

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    return (
        <div className="bug-edit">
            <div className="header">
                <Link to="/bug">Back to List</Link>
            </div>
            <div className="main">
                <h1>{bugId ? 'Edit' : 'Create'} Bug</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={bugValidation}
                    onSubmit={onSubmit}
                >
                    {({ isValid }) => (
                        <Form>
                            <FormikInput
                                label="Title"
                                name="title"
                                type="text"
                                required
                            />
                            <FormikTextArea
                                label="Description"
                                name="description"
                                required
                            />

                            <FormikSelect
                                label="Severity"
                                name="severity"
                                options={severityOptions}
                                required
                            />

                            <FormikInput
                                label="Labels (comma-separated)"
                                name="labels"
                                type="text"
                            />

                            <div className="actions">
                                <button
                                    className="btn-primary"
                                    type="submit"
                                    disabled={!isValid}
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
