import { PageNav } from './PageNav'
import { PageSizeSelect } from './PageSizeSelect'

export function PaginationFooter({
    totalCount,
    itemType,
    curPageIdx,
    setCurPageIdx,
    maxPageIdx,
    pageSize,
    setPageSize,
}) {
    return (
        <div className="pagination-footer">
            {totalCount !== null && (
                <div className="total-count">
                    Total: {totalCount} {itemType}
                </div>
            )}
            <PageNav
                curPageIdx={curPageIdx}
                setCurPageIdx={setCurPageIdx}
                maxPageIdx={maxPageIdx}
            />
            <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
        </div>
    )
}
