import { useContext } from 'react'
import { useIndex } from '../customHooks/useIndex.js'
import { LoginContext } from '../contexts/LoginContext.js'
import { userService } from '../services/user.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from '../cmps/user/UserList.jsx'
import { UserIndexTopbar } from '../cmps/user/UserIndexTopbar.jsx'
import { PaginationFooter } from '../cmps/general/PaginationFooter.jsx'
import { utilService } from '../services/util.service.js'

export function UserIndex() {
    const { loggedinUser } = useContext(LoginContext)

    const {
        view,
        setFilter,
        setSort,
        setCurPageIdx,
        setPageSize,
        entities: users,
        totalCount,
        maxPageIdx,
        loadEntities,
    } = useIndex(userService)

    async function onRemoveUser(userId) {
        try {
            await userService.remove(userId)
            loadEntities()
            showSuccessMsg('User deleted')
        } catch (err) {
            console.error('Error:', err)
            showErrorMsg(utilService.getErrorMessage(err))
        }
    }

    if (!userService.isViewUserListAllowed(loggedinUser)) {
        return <h1>Not authorized</h1>
    }

    if (!view || !users) return <div>Loading...</div>

    return (
        <main className="user-index entity-index">
            <h1>Users</h1>
            <UserIndexTopbar
                filter={view.filter}
                setFilter={setFilter}
                sort={view.sort}
                setSort={setSort}
            />

            <UserList users={users} onRemoveUser={onRemoveUser} />

            <PaginationFooter
                totalCount={totalCount}
                itemType="users"
                curPageIdx={view.curPageIdx}
                setCurPageIdx={setCurPageIdx}
                maxPageIdx={maxPageIdx}
                pageSize={view.pageSize}
                setPageSize={setPageSize}
            />
        </main>
    )
}
