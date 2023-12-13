import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'
import { userService } from '../../services/user.service'

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
        setDraft((prev) => ({ ...prev, minScore: +prev.minScore }))
    }

    return (
        <div className="user-filter">
            <form onSubmit={onSubmit}>
                <label htmlFor="txt">Text search</label>
                <input
                    type="text"
                    name="txt"
                    id="txt"
                    onChange={onChange}
                    value={draft.txt}
                />

                <label htmlFor="minScore">Min score</label>
                <input
                    type="text"
                    name="minScore"
                    id="minScore"
                    onChange={onChange}
                    value={draft.minScore}
                />
            </form>
        </div>
    )
}
