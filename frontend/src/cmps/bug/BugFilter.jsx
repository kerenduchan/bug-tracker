import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'
import { FormSelect } from '../general/FormSelect'
import { bugService } from '../../services/bug.service'

export function BugFilter({ filter, setFilter }) {
    const [draft, handleChange, setDraft] = useForm(filter)
    const severityOptions = bugService.getAllSeverities().map((s) => ({
        text: `${s}`,
        value: s,
    }))

    useEffect(() => {
        setFilter(draft)
    }, [draft])

    function onSubmit(e) {
        e.preventDefault()
    }

    function onChange(e) {
        handleChange(e)
        setDraft((prev) => ({ ...prev, minSeverity: +prev.minSeverity }))
    }

    return (
        <div className="bug-filter">
            <form onSubmit={onSubmit}>
                <label htmlFor="txt">Text search</label>
                <input
                    type="text"
                    name="txt"
                    id="txt"
                    onChange={onChange}
                    value={draft.txt}
                />
                <label htmlFor="txt">Labels (comma separated)</label>
                <input
                    type="text"
                    name="labels"
                    id="labels"
                    onChange={onChange}
                    value={draft.labels}
                />

                <FormSelect
                    name="minSeverity"
                    title="Min Severity"
                    value={draft.minSeverity}
                    onChange={onChange}
                    options={severityOptions}
                />
            </form>
        </div>
    )
}
