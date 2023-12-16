import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useIndex } from '../customHooks/useIndex.js'
import { LoginContext } from '../contexts/LoginContext.js'
import { userService } from '../services/user.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from '../cmps/user/UserList.jsx'
import { PageNav } from '../cmps/general/PageNav.jsx'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect.jsx'
import { UserIndexTopbar } from '../cmps/user/UserIndexTopbar.jsx'

export function UserIndex() {
    const { loggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()
    const {
        loadEntities,
        filter,
        setFilter,
        sort,
        setSort,
        totalCount,
        curPageIdx,
        setCurPageIdx,
        maxPageIdx,
        pageSize,
        setPageSize,
        entities: users,
    } = useIndex(userService)

    async function onRemoveUser(userId) {
        if (!loggedinUser) {
            navigate('/login')
            return
        }

        try {
            await userService.remove(userId)
            loadEntities()
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

    if (!filter || !users) return <div>Loading...</div>

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
