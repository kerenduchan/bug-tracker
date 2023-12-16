import { useNavigate } from 'react-router'
import { BugFilter } from './BugFilter.jsx'
import { SortSelect } from '../general/SortSelect.jsx'
import { bugService } from '../../services/bug.service.js'

export function BugIndexTopbar({ filter, setFilter, sort, setSort }) {
    const navigate = useNavigate()

    function onCreateBug() {
        navigate('/bug/edit/')
    }

    return (
        <div className="bug-index-topbar">
            <div className="filter-title">Filter</div>
            <BugFilter filter={filter} setFilter={setFilter} />

            <div className="sort-title">Sort</div>
            <SortSelect
                sort={sort}
                setSort={setSort}
                options={bugService.getSortByOptions()}
            />

            <button
                className="btn-primary btn-create-bug"
                onClick={onCreateBug}
            >
                Create Bug
            </button>
        </div>
    )
}
