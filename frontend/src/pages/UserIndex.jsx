import { useEffect, useState } from 'react'
import { SortSelect } from '../cmps/general/SortSelect'
import { userService } from '../services/user.service'
import { UserList } from '../cmps/user/UserList'
import { PageNav } from '../cmps/general/PageNav'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { UserFilter } from '../cmps/user/UserFilter'
import { useNavigate } from 'react-router'

export function UserIndex() {
    const [users, setUsers] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(userService.getDefaultFilter())
    const [sort, setSort] = useState(userService.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers(curPageIdx)
    }, [curPageIdx])

    useEffect(() => {
        loadUsers(0)
    }, [filter, sort, pageSize])

    async function loadUsers(pageIdx) {
        setCurPageIdx(pageIdx)
        const res = await userService.query(filter, sort, pageIdx, pageSize)

        const { data, totalCount } = res
        setUsers(data)
        setTotalCount(totalCount)
        setMaxPageIdx(Math.ceil(totalCount / pageSize))
    }

    async function onRemoveUser(userId) {
        try {
            await userService.remove(userId)
            loadUsers(0)
            showSuccessMsg('User removed')
        } catch (err) {
            console.error('Error from onRemoveUser ->', err)
            showErrorMsg('Cannot remove user')
        }
    }

    async function onAddUser() {
        navigate('/user/edit/')
    }

    async function onEditUser(user) {
        navigate(`/user/edit/${user._id}`)
    }

    return (
        <main className="main-layout">
            <h1>Users</h1>
            <main>
                <button onClick={onAddUser}>Add User</button>
                <UserFilter filter={filter} setFilter={setFilter} />
                <SortSelect
                    sort={sort}
                    setSort={setSort}
                    options={userService.getSortByOptions()}
                />

                <UserList
                    users={users}
                    onRemoveUser={onRemoveUser}
                    onEditUser={onEditUser}
                />
                {totalCount !== null && <p>Total: {totalCount} users</p>}

                <PageNav
                    curPageIdx={curPageIdx}
                    setCurPageIdx={setCurPageIdx}
                    maxPageIdx={maxPageIdx}
                />
                <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
            </main>
        </main>
    )
}
