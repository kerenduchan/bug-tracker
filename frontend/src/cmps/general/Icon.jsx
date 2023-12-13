export function Icon({ type, full = false, className, onClick }) {
    return (
        <span
            className={`icon ${type}-icon material-symbols-outlined ${
                full ? 'full' : ''
            } ${className ? className : ''}`}
            onClick={onClick}
        >
            {type}
        </span>
    )
}
