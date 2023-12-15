import { Link, useNavigate } from 'react-router-dom'
import { utilService } from '../../services/util.service'
import { Icon } from '../general/Icon'

export function BugPreview({ bug, onRemoveBug }) {
    const navigate = useNavigate()

    function onEdit() {
        navigate(`/bug/edit/${bug._id}`)
    }

    return (
        <article className="bug-preview">
            <div className="created-at">
                {utilService.formatDateTime(bug.createdAt)}
            </div>
            <div className="created-by">
                {bug.creator.fullname} ({bug.creator.username})
            </div>
            <div className="severity">{bug.severity}</div>
            <div className="title">{bug.title}</div>
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
                    className="btn-icon-round"
                    onClick={() => onRemoveBug(bug._id)}
                >
                    <Icon type="delete" />
                </button>
                <button className="btn-icon-round" onClick={onEdit}>
                    <Icon type="edit" />
                </button>
            </div>
        </article>
    )
}
