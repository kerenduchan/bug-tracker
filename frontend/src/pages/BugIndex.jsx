import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useIndex } from '../customHooks/useIndex.js'
import { LoginContext } from '../contexts/LoginContext.js'
import { bugService } from '../services/bug.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug/BugList.jsx'
import { BugIndexTopbar } from '../cmps/bug/BugIndexTopbar.jsx'
import { PaginationFooter } from '../cmps/general/PaginationFooter.jsx'

export function BugIndex() {
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
        entities: bugs,
    } = useIndex(bugService)

    async function onRemoveBug(bugId) {
        if (!loggedinUser) {
            navigate('/login')
            return
        }

        try {
            await bugService.remove(bugId)
            loadEntities()
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.error('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    if (!filter || !bugs) return <div>Loading...</div>

    return (
        <main className="bug-index entity-index">
            <h1>Bugs</h1>
            <BugIndexTopbar
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
            />

            <BugList bugs={bugs} onRemoveBug={onRemoveBug} />

            <PaginationFooter
                totalCount={totalCount}
                itemType="bugs"
                curPageIdx={curPageIdx}
                setCurPageIdx={setCurPageIdx}
                maxPageIdx={maxPageIdx}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </main>
    )
}
