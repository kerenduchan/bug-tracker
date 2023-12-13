import { useEffect } from 'react'
import { utilService } from '../../services/util.service'
import { useForm } from '../../customHooks/useForm'
import { FormSelect } from './FormSelect'

export function SortSelect({ sort, setSort, options }) {
    const [draft, handleChange] = useForm(sort)

    useEffect(() => {
        setSort(draft)
    }, [draft])

    function onSubmit(e) {
        e.preventDefault()
    }

    return (
        <form onSubmit={onSubmit} className="sort-select">
            <FormSelect
                name="sortBy"
                title="Sort By"
                value={draft.sortBy}
                onChange={handleChange}
                options={options}
            />

            <FormSelect
                name="sortDir"
                title="Sort Direction"
                value={draft.sortDir}
                onChange={handleChange}
                options={utilService.getSortDirOptions()}
            />
        </form>
    )
}
