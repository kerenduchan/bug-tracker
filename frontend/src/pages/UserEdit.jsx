import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { userService } from '../services/user.service'
import { useForm } from '../customHooks/useForm'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { LoginContext } from '../contexts/LoginContext'

export function UserEdit() {
    const { loggedinUser } = useContext(LoginContext)
    const [draft, handleChange, setDraft] = useForm(null)
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        if (!userId) {
            const emptyUser = userService.getEmptyUser()
            setDraft(emptyUser)
            return
        }
        try {
            const user = await userService.getById(userId)
            setDraft(user)
        } catch (err) {
            console.error(err)
            showErrorMsg(err.response.data)
        }
    }

    async function onSubmit(e) {
        e.preventDefault()

        const userToSave = {
            ...draft,
            score: +draft.score,
        }

        if (userToSave.username.length === 0) {
            showErrorMsg('Username must not be empty')
            return
        }

        if (userToSave.fullname.length === 0) {
            showErrorMsg('Full Name must not be empty')
            return
        }

        if (userToSave.password.length === 0) {
            showErrorMsg('Password must not be empty')
            return
        }

        try {
            await userService.save(userToSave)
            showSuccessMsg(`User ${userId ? 'updated' : 'created'}`)
        } catch (err) {
            showErrorMsg(`Failed to ${userId ? 'update' : 'create'} user`)
        }
        navigate('/user')
    }

    function onCancel() {
        navigate('/user')
    }

    function isAuthorized() {
        return loggedinUser?.isAdmin
    }

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    if (!draft) return <h1>loading....</h1>
    return (
        <div className="user-edit">
            <div className="header">
                <Link to="/user">Back to List</Link>
            </div>
            <div className="main">
                <h1>{userId ? 'Edit' : 'Create'} User</h1>

                <form onSubmit={onSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        autoComplete="username"
                        value={draft.username}
                        onChange={handleChange}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        value={draft.password}
                        onChange={handleChange}
                    />

                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        id="fullname"
                        name="fullname"
                        value={draft.fullname}
                        onChange={handleChange}
                    />

                    <label htmlFor="score">Score:</label>
                    <input
                        id="score"
                        name="score"
                        value={draft.score}
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
