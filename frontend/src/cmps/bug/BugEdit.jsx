import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { bugService } from '../../services/bug.service'
import { useForm } from '../../customHooks/useForm'

export function BugEdit() {
    const [draft, handleChange, setDraft] = useForm(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        if (!bugId) {
            setDraft(bugService.getEmptyBug())
            return
        }
        try {
            const bug = await bugService.getById(bugId)
            setDraft(bug)
        } catch (err) {
            console.log(err)
            showErrorMsg(err.response.data)
        }
    }

    if (!draft) return <h1>loading....</h1>
    return (
        <div className="bug-edit">
            <div className="header">
                <Link to="/bug">Back to List</Link>
            </div>
            <div className="main">
                <form>
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
                    <input
                        id="severity"
                        name="severity"
                        value={draft.severity}
                        onChange={handleChange}
                    />
                </form>
            </div>
        </div>
    )
}
