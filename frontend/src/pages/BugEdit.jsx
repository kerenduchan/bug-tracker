import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { bugService } from '../services/bug.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { LoginContext } from '../contexts/LoginContext'
import { useForm } from '../customHooks/useForm'
import { FormSelect } from '../cmps/general/FormSelect'

export function BugEdit() {
    const { loggedinUser } = useContext(LoginContext)

    const [draft, handleChange, setDraft] = useForm(null)
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
            setDraft({ ...emptyBug, labels: '' })
            return
        }
        try {
            const bugToEdit = await bugService.getById(bugId)
            setDraft({ ...bugToEdit, labels: bugToEdit.labels.join(',') })
        } catch (err) {
            console.error(err)
            showErrorMsg(err.response.data)
        }
    }

    async function onSubmit(e) {
        e.preventDefault()

        const bugToSave = {
            ...draft,
            severity: +draft.severity,
            labels: draft.labels.split(','),
        }

        if (bugToSave.title.length === 0) {
            showErrorMsg('Title must not be empty')
            return
        }

        try {
            await bugService.save(bugToSave)
            showSuccessMsg(`Bug ${bugId ? 'updated' : 'created'}`)
        } catch (err) {
            showErrorMsg(`Failed to ${bugId ? 'update' : 'create'} bug`)
        }
        navigate('/bug')
    }

    function onCancel() {
        navigate('/bug')
    }

    function isAuthorized() {
        if (!loggedinUser) {
            // must be logged in to create/edit
            return false
        }
        if (!bugId) {
            // create bug - everyone is authorized
            return true
        }
        // only admin or bug creator can edit a bug
        return loggedinUser.isAdmin || loggedinUser._id === draft.creatorId
    }

    if (!draft) return <h1>loading....</h1>

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

                <form onSubmit={onSubmit}>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        name="title"
                        value={draft.title}
                        onChange={handleChange}
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={draft.description}
                        onChange={handleChange}
                    />

                    <label htmlFor="severity">Severity:</label>
                    <FormSelect
                        id="severity"
                        name="severity"
                        title="Severity"
                        value={draft.severity}
                        onChange={handleChange}
                        options={severityOptions}
                    />

                    <label htmlFor="labels">Labels (comma-separated):</label>
                    <input
                        id="labels"
                        name="labels"
                        value={draft.labels}
                        onChange={handleChange}
                    />

                    <div className="actions">
                        <button>Save</button>
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
