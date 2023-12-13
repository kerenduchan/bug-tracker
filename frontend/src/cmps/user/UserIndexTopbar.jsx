import { useNavigate } from 'react-router'
import { UserFilter } from './UserFilter.jsx'
import { SortSelect } from '../general/SortSelect.jsx'
import { userService } from '../../services/user.service.js'

export function UserIndexTopbar({ filter, setFilter, sort, setSort }) {
    const navigate = useNavigate()

    function onCreateUser() {
        navigate('/user/edit/')
    }

    return (
        <div className="user-index-topbar">
            <UserFilter filter={filter} setFilter={setFilter} />
            <SortSelect
                sort={sort}
                setSort={setSort}
                options={userService.getSortByOptions()}
            />
            <button className="btn-primary" onClick={onCreateUser}>
                Create User
            </button>
        </div>
    )
}
