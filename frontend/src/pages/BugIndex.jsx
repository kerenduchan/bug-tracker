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
        view,
        setFilter,
        setSort,
        setCurPageIdx,
        setPageSize,
        entities: bugs,
        totalCount,
        maxPageIdx,
        loadEntities,
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

    if (!view || !bugs) return <div>Loading...</div>

    return (
        <main className="bug-index entity-index">
            <h1>Bugs</h1>
            <BugIndexTopbar
                filter={view.filter}
                setFilter={setFilter}
                sort={view.sort}
                setSort={setSort}
            />

            <BugList bugs={bugs} onRemoveBug={onRemoveBug} />

            <PaginationFooter
                totalCount={totalCount}
                itemType="bugs"
                curPageIdx={view.curPageIdx}
                setCurPageIdx={setCurPageIdx}
                maxPageIdx={maxPageIdx}
                pageSize={view.pageSize}
                setPageSize={setPageSize}
            />
        </main>
    )
}
