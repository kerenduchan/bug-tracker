import { bugService } from '../services/bug.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/bug/BugFilter.jsx'
import { SortSelect } from '../cmps/general/SortSelect.jsx'
import { PageNav } from '../cmps/general/PageNav.jsx'
import { PageSizeSelect } from '../cmps/general/PageSizeSelect.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(bugService.getDefaultFilter())
    const [sort, setSort] = useState(bugService.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)

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

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
        }
        try {
            await bugService.save(bug)
            loadBugs(0)
            showSuccessMsg('Bug added')
        } catch (err) {
            console.error('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {
            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs((prevBugs) =>
                prevBugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
            )
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    return (
        <main className="main-layout">
            <h3>Bugs</h3>
            <main>
                <button onClick={onAddBug}>Add Bug</button>
                <BugFilter filter={filter} setFilter={setFilter} />
                <SortSelect
                    sort={sort}
                    setSort={setSort}
                    options={bugService.getSortByOptions()}
                />

                <BugList
                    bugs={bugs}
                    onRemoveBug={onRemoveBug}
                    onEditBug={onEditBug}
                />
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
