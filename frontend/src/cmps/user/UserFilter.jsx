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
        <div className="user-filter">
            <div className="title">Filter</div>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <input
                        type="text"
                        name="txt"
                        id="txt"
                        onChange={onChange}
                        value={draft.txt}
                        placeholder="Search for a user..."
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
        </div>
    )
}
