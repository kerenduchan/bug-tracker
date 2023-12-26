import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { utilService } from '../services/util.service'

export function useIndex(service) {
    const [entities, setEntities] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [view, setView] = useState(null)
    const [totalCount, setTotalCount] = useState(null)
    const [maxPageIdx, setMaxPageIdx] = useState(0)

    // search params must be the single source of truth in order for
    // "back" to work
    useEffect(() => {
        const updatedView = service.parseSearchParams(searchParams)
        setView(updatedView)
    }, [searchParams])

    useEffect(() => {
        if (!view) return
        loadEntities()
    }, [view])

    function setFilter(filter) {
        onViewFieldChange('filter', filter)
    }

    function setSort(sort) {
        onViewFieldChange('sort', sort)
    }

    function setCurPageIdx(curPageIdx) {
        onViewFieldChange('curPageIdx', curPageIdx)
    }

    function setPageSize(pageSize) {
        onViewFieldChange('pageSize', pageSize)
    }

    // update the view indirectly, through the search params
    function onViewFieldChange(field, value) {
        if (utilService.simpleIsEqual(value, view[field])) {
            return
        }
        const updatedView = { ...view, [field]: value }
        const updatedSearchParams = service.buildSearchParams(
            updatedView,
            service.getDefaultFilter(),
            service.getDefaultSort()
        )
        setSearchParams(updatedSearchParams)
    }

    async function loadEntities() {
        const { filter, sort, curPageIdx, pageSize } = view
        const res = await service.query(filter, sort, curPageIdx, pageSize)
        const { data, totalCount } = res
        setEntities(data)
        setTotalCount(totalCount)
        setMaxPageIdx(Math.ceil(totalCount / pageSize))
    }

    return {
        view,
        setFilter,
        setSort,
        setCurPageIdx,
        setPageSize,
        entities,
        totalCount,
        maxPageIdx,
        loadEntities,
    }
}
