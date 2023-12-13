export function PageNav({ curPageIdx, setCurPageIdx, maxPageIdx }) {
    const pageIdxs = Array.from(Array(maxPageIdx).keys())
    return (
        <div className="page-nav">
            {pageIdxs.map((pageIdx) => (
                <div
                    onClick={() => setCurPageIdx(pageIdx)}
                    key={pageIdx}
                    className={`page-idx ${
                        curPageIdx === pageIdx ? 'current' : ''
                    }`}
                >
                    {pageIdx + 1}
                </div>
            ))}
        </div>
    )
}
