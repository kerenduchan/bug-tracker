import { useEffect } from 'react'
import { useForm } from '../../customHooks/useForm'
import { FormSelect } from './FormSelect'

export function PageSizeSelect({ pageSize, setPageSize }) {
    const [draft, handleChange] = useForm({ pageSize })

    const options = [5, 10, 20, 50].map((o) => ({ text: `${o}`, value: o }))

    useEffect(() => {
        setPageSize(draft.pageSize)
    }, [draft])

    function onSubmit(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={onSubmit} className="bug-page-size">
            <FormSelect
                name="pageSize"
                title="Page Size"
                value={draft.pageSize}
                onChange={handleChange}
                options={options}
            />
        </form>
    )
}
