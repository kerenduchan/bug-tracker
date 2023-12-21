import { useForm } from '../../../customHooks/useForm'

export function BugCommentCreateForm({ onCreateComment, onCancel }) {
    const [draft, handleChange] = useForm({ txt: '' })

    function onSubmit(e) {
        e.preventDefault()
        onCreateComment(draft.txt)
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
