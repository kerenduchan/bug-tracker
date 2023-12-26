import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'
import { useDebounce } from '../../customHooks/useDebounce'

export function UserFilter({ filter, setFilter }) {
    const [draft, handleChange, setDraft] = useForm(filter)
    const debouncedDraft = useDebounce(draft)

    useEffect(() => {
        setDraft(filter)
    }, [filter])

    useEffect(() => {
        setFilter(debouncedDraft)
    }, [debouncedDraft])

    function onSubmit(e) {
        e.preventDefault()
    }

    return (
        <form className="entity-filter-or-sort user-filter" onSubmit={onSubmit}>
            <div className="field">
                <label htmlFor="txt">Text Search</label>
                <input
                    type="text"
                    name="txt"
                    id="txt"
                    onChange={handleChange}
                    value={draft.txt}
                />
            </div>

            <div className="field">
                <label htmlFor="minScore">Min score</label>
                <input
                    type="text"
                    name="minScore"
                    id="minScore"
                    onChange={handleChange}
                    value={draft.minScore}
                />
            </div>
        </form>
    )
}
