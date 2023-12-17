import { BugPreview } from './BugPreview'

export function BugList({ bugs, onRemoveBug }) {
    return (
        <div className="bug-list">
            <div className="header">
                <div className="title">Severity</div>
                <div className="title">Created at</div>
                <div className="title">Created by</div>
                <div className="title">Title</div>
                <div className="title">Labels</div>
                <div className="title">Description</div>
            </div>

            <ul className="bugs">
                {bugs.map((bug) => (
                    <li key={bug._id}>
                        <BugPreview bug={bug} onRemoveBug={onRemoveBug} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
