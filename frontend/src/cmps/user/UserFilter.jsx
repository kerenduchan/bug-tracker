import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'

export function UserFilter({ filter, setFilter }) {
    const [draft, handleChange, setDraft] = useForm(filter)

    useEffect(() => {
        setFilter(draft)
    }, [draft])

    function onSubmit(e) {
        e.preventDefault()
    }

    function onChange(e) {
        handleChange(e)
    }

    return (
        <form className="entity-filter-or-sort user-filter" onSubmit={onSubmit}>
            <div className="field">
                <label htmlFor="txt">Text Search</label>
                <input
                    type="text"
                    name="txt"
                    id="txt"
                    onChange={onChange}
                    value={draft.txt}
                />
            </div>

            <div className="field">
                <label htmlFor="minScore">Min score</label>
                <input
                    type="text"
                    name="minScore"
                    id="minScore"
                    onChange={onChange}
                    value={draft.minScore}
                />
            </div>
        </form>
    )
}
