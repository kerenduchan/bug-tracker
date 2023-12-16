import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useIndex(service) {
    const [entities, setEntities] = useState(null)
    const [totalCount, setTotalCount] = useState(null)
    const [filter, setFilter] = useState(null)
    const [sort, setSort] = useState(service.getDefaultSort())
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [maxPageIdx, setMaxPageIdx] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const parsedParams = service.parseSearchParams(searchParams)
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
        loadEntities()
    }, [curPageIdx])

    useEffect(() => {
        if (!filter) {
            return
        }
        setSearchParams(
            service.buildSearchParams(filter, sort, curPageIdx, pageSize)
        )
        if (curPageIdx !== 0) {
            setCurPageIdx(0)
        } else {
            loadEntities()
        }
    }, [filter, sort, pageSize])

    async function loadEntities() {
        const res = await service.query(filter, sort, curPageIdx, pageSize)
        const { data, totalCount } = res
        setEntities(data)
        setTotalCount(totalCount)
        setMaxPageIdx(Math.ceil(totalCount / pageSize))
    }

    return {
        filter,
        setFilter,
        sort,
        setSort,
        totalCount,
        entities,
        loadEntities,
        curPageIdx,
        setCurPageIdx,
        maxPageIdx,
        pageSize,
        setPageSize,
        entities,
    }
}
