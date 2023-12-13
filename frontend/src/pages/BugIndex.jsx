import { bugService } from '../services/bug.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { PageNav } from '../cmps/general/PageNav.jsx'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect.jsx'
import { useNavigate } from 'react-router'
import { BugIndexTopbar } from '../cmps/bug/BugIndexTopbar.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(bugService.getDefaultFilter())
    const [sort, setSort] = useState(bugService.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        loadBugs(curPageIdx)
    }, [curPageIdx])

    useEffect(() => {
        loadBugs(0)
    }, [filter, sort, pageSize])

    async function loadBugs(pageIdx) {
        setCurPageIdx(pageIdx)
        const res = await bugService.query(filter, sort, pageIdx, pageSize)

        const { data, totalCount } = res
        setBugs(data)
        setTotalCount(totalCount)
        setMaxPageIdx(Math.ceil(totalCount / pageSize))
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            loadBugs(0)
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.error('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    return (
        <main className="main-layout">
            <h1>Bugs</h1>
            <main>
                <BugIndexTopbar
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                />

                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
                {totalCount !== null && <p>Total: {totalCount} bugs</p>}

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
