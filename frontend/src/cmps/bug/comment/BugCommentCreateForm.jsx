import { useForm } from '../../../customHooks/useForm'

export function BugCommentCreateForm({ onCreate, onCancel }) {
    const [draft, handleChange] = useForm({ txt: '' })

    function onSubmit(e) {
        e.preventDefault()
        onCreate(draft.txt)
    }
    return (
        <form className="bug-comment-create-form" onSubmit={onSubmit}>
            <textarea id="txt" name="txt" onChange={handleChange} autoFocus />
            <div className="actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={draft.txt === ''}
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
        </form>
    )
}
