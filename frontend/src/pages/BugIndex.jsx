import { useState, useEffect, useContext } from 'react'
import { LoginContext } from '../contexts/LoginContext.js'
import { bugService } from '../services/bug.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug/BugList.jsx'
import { PageNav } from '../cmps/general/PageNav.jsx'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect.jsx'
import { BugIndexTopbar } from '../cmps/bug/BugIndexTopbar.jsx'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

export function BugIndex() {
    const { loggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()
    const [bugs, setBugs] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(null)
    const [sort, setSort] = useState(bugService.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const parsedParams = bugService.parseSearchParams(searchParams)
        setFilter(parsedParams.filter)
        setSort(parsedParams.sort)
        setCurPageIdx(parsedParams.curPageIdx)
        setPageSize(parsedParams.pageSize)
    }, [])

    useEffect(() => {
        setSearchParams((prev) => {
            if (curPageIdx === 0) {
                delete prev.curPageIdx
            } else {
                return { ...prev, curPageIdx }
            }
        })
        loadBugs()
    }, [curPageIdx])

    useEffect(() => {
        if (!filter) {
            return
        }
        setSearchParams(
            bugService.buildSearchParams(filter, sort, curPageIdx, pageSize)
        )
        if (curPageIdx !== 0) {
            setCurPageIdx(0)
        } else {
            loadBugs()
        }
    }, [filter, sort, pageSize])

    async function loadBugs() {
        const res = await bugService.query(filter, sort, curPageIdx, pageSize)

        const { data, totalCount } = res
        setBugs(data)
        setTotalCount(totalCount)
        setMaxPageIdx(Math.ceil(totalCount / pageSize))
    }

    async function onRemoveBug(bugId) {
        if (!loggedinUser) {
            navigate('/login')
            return
        }

        try {
            await bugService.remove(bugId)
            loadBugs()
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.error('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    if (!filter) return <div>Loading...</div>

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
