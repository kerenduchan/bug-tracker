import { useContext, useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { UserList } from '../cmps/user/UserList'
import { PageNav } from '../cmps/general/PageNav'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { UserIndexTopbar } from '../cmps/user/UserIndexTopbar'
import { LoginContext } from '../contexts/LoginContext'

export function UserIndex() {
    const { loggedinUser } = useContext(LoginContext)
    const [users, setUsers] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(userService.getDefaultFilter())
    const [sort, setSort] = useState(userService.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)

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

    function isAuthorized() {
        return loggedinUser?.isAdmin
    }

    if (!isAuthorized()) {
        return <h1>Not authorized</h1>
    }

    return (
        <main className="main-layout">
            <h1>Users</h1>
            <main>
                <UserIndexTopbar
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                />

                <UserList users={users} onRemoveUser={onRemoveUser} />
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
