import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'
import { FormSelect } from '../general/FormSelect'
import { bugService } from '../../services/bug.service'
import { useDebounce } from '../../customHooks/useDebounce'

export function BugFilter({ filter, setFilter }) {
    const [draft, handleChange, setDraft] = useForm(filter)
    const debouncedDraft = useDebounce(draft)

    const severityOptions = bugService.getAllSeverities().map((s) => ({
        text: `${s}`,
        value: s,
    }))

    useEffect(() => {
        setDraft(filter)
    }, [])

    useEffect(() => {
        setFilter(debouncedDraft)
    }, [debouncedDraft])

    function onSubmit(e) {
        e.preventDefault()
    }

    return (
        <form className="entity-filter-or-sort bug-filter" onSubmit={onSubmit}>
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
                <label htmlFor="creatorUsername">Creator username</label>
                <input
                    type="text"
                    name="creatorUsername"
                    id="creatorUsername"
                    onChange={handleChange}
                    value={draft.creatorUsername}
                />
            </div>

            <div className="field">
                <label htmlFor="labels">Labels (comma-separated)</label>
                <input
                    type="text"
                    name="labels"
                    id="labels"
                    onChange={handleChange}
                    value={draft.labels}
                />
            </div>

            <div className="field">
                <FormSelect
                    name="minSeverity"
                    title="Min Severity"
                    value={draft.minSeverity}
                    onChange={handleChange}
                    options={severityOptions}
                />
            </div>
        </form>
    )
}
