import { useForm } from '../../customHooks/useForm'

export function CreateCommentForm({ onCreateComment, onCancel }) {
    const [draft, handleChange] = useForm({ txt: '' })

    function onSubmit(e) {
        e.preventDefault()
        onCreateComment(draft.txt)
    }
    return (
        <form onSubmit={onSubmit}>
            <input type="text" id="txt" name="txt" onChange={handleChange} />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    )
}
