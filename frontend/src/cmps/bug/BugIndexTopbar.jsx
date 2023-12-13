import { useNavigate } from 'react-router'
import { BugFilter } from './BugFilter.jsx'
import { SortSelect } from '../general/SortSelect.jsx'
import { bugService } from '../../services/bug.service.js'

export function BugIndexTopbar({ filter, setFilter, sort, setSort }) {
    const navigate = useNavigate()

    function onAddBug() {
        navigate('/bug/edit/')
    }

    return (
        <div className="bug-index-topbar">
            <BugFilter filter={filter} setFilter={setFilter} />
            <SortSelect
                sort={sort}
                setSort={setSort}
                options={bugService.getSortByOptions()}
            />
            <button onClick={onAddBug}>Add Bug</button>
        </div>
    )
}
