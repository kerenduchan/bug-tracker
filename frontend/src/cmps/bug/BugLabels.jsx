export function BugLabels({ labels }) {
    return (
        <ul className="bug-labels">
            {labels.map((label) => (
                <li key={label} className="bug-label">
                    {label}
                </li>
            ))}
        </ul>
    )
}
