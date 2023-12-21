import { useForm } from '../../../customHooks/useForm'

export function BugCommentEdit({ comment, onSave, onCancel }) {
    const [draft, handleChange] = useForm(comment || { txt: '' })

    console.log(draft)

    function onSubmit(e) {
        e.preventDefault()
        onSave(draft)
    }
    return (
        <form className="bug-comment-edit" onSubmit={onSubmit}>
            <textarea
                id="txt"
                name="txt"
                value={draft.txt}
                onChange={handleChange}
                autoFocus
            />
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
