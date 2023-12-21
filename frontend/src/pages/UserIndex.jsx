import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useIndex } from '../customHooks/useIndex.js'
import { LoginContext } from '../contexts/LoginContext.js'
import { userService } from '../services/user.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from '../cmps/user/UserList.jsx'
import { UserIndexTopbar } from '../cmps/user/UserIndexTopbar.jsx'
import { PaginationFooter } from '../cmps/general/PaginationFooter.jsx'

export function UserIndex() {
    const { loggedinUser } = useContext(LoginContext)

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
        try {
            await userService.remove(userId)
            loadEntities()
            showSuccessMsg('User deleted')
        } catch (err) {
            console.error('Error:', err)
            showErrorMsg('Failed to delete user: ' + err.response.data.error)
        }
    }

    if (!userService.isViewUserListAllowed(loggedinUser)) {
        return <h1>Not authorized</h1>
    }

    if (!filter || !users) return <div>Loading...</div>

    return (
        <main className="user-index entity-index">
            <h1>Users</h1>
            <UserIndexTopbar
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
            />

            <UserList users={users} onRemoveUser={onRemoveUser} />

            <PaginationFooter
                totalCount={totalCount}
                itemType="users"
                curPageIdx={curPageIdx}
                setCurPageIdx={setCurPageIdx}
                maxPageIdx={maxPageIdx}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </main>
    )
}
