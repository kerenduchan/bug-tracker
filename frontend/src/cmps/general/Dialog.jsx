import { createPortal } from 'react-dom'

export function Dialog({ children }) {
    return createPortal(
        <div className="dialog-overlay">
            <div className="dialog">{children}</div>
        </div>,
        document.getElementById('root')
    )
}
