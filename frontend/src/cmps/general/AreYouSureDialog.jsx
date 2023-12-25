import { Dialog } from './Dialog'

export function AreYouSureDialog({
    title,
    text,
    confirmText,
    onConfirm,
    onCancel,
}) {
    return (
        <Dialog>
            <div className="are-you-sure-dialog">
                <div className="title">{title}</div>
                <div className="text">{text}</div>

                <div className="actions">
                    <button className="btn-primary" onClick={onConfirm}>
                        {confirmText || 'Confirm'}
                    </button>
                    <button className="btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
