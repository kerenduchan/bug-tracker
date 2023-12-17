export function BugLabels({ labels }) {
    return (
        <ul className="bug-labels">
            {labels.map((label) => (
                <li className="bug-label">{label}</li>
            ))}
        </ul>
    )
}
