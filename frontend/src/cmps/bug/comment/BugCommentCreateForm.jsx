import { useForm } from '../../../customHooks/useForm'

export function BugCommentCreateForm({ onCreateComment, onCancel }) {
    const [draft, handleChange] = useForm({ txt: '' })

    function onSubmit(e) {
        e.preventDefault()
        onCreateComment(draft.txt)
    }
    return (
        <form className="bug-comment-create-form" onSubmit={onSubmit}>
            <input
                type="text"
                id="txt"
                name="txt"
                onChange={handleChange}
                autoFocus
            />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    )
}
