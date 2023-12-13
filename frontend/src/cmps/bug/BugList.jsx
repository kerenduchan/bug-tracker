import { BugPreview } from './BugPreview'

export function BugList({ bugs, onRemoveBug }) {
    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li key={bug._id}>
                    <BugPreview bug={bug} onRemoveBug={onRemoveBug} />
                </li>
            ))}
        </ul>
    )
}
