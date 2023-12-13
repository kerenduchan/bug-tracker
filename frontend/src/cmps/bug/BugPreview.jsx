import { Link } from 'react-router-dom'

export function BugPreview({ bug, onRemoveBug, onEditBug }) {
    return (
        <article className="bug-preview">
            <h4 className="title">{bug.title}</h4>
            <div className="severity">{bug.severity}</div>
            <div className="description">{bug.description}</div>
            <div className="labels">
                {bug.labels.map((l) => (
                    <div key={l} className="label">
                        {l}
                    </div>
                ))}
            </div>
            <Link to={`/bug/${bug._id}`} />
            <div className="actions">
                <button
                    className="btn-delete"
                    onClick={() => onRemoveBug(bug._id)}
                >
                    Delete
                </button>
                <button className="btn-edit" onClick={() => onEditBug(bug)}>
                    Edit
                </button>
            </div>
        </article>
    )
}
