import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contexts/LoginContext'
import { utilService } from '../../services/util.service'
import { Icon } from '../general/Icon'
import { bugService } from '../../services/bug.service'
import { BugLabels } from './BugLabels'
import { useState } from 'react'
import { AreYouSureDialog } from '../general/AreYouSureDialog'

export function BugPreview({ bug, onRemoveBug }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { loggedinUser } = useContext(LoginContext)
    const navigate = useNavigate()

    function onEdit() {
        navigate(`/bug/edit/${bug._id}`)
    }

    function onDeleteConfirm() {
        setShowDeleteDialog(false)
        onRemoveBug(bug._id)
    }

    function isDeleteOrEditBugAllowed() {
        return bugService.isDeleteOrEditBugAllowed(loggedinUser, bug)
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
            <BugLabels labels={bug.labels} />
            <div className="comment-count">{bug.commentCount}</div>

            <Link to={`/bug/${bug._id}`} />
            {isDeleteOrEditBugAllowed() && (
                <div className="actions">
                    <button
                        className="btn-icon-round"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Icon type="delete" />
                    </button>
                    <button className="btn-icon-round" onClick={onEdit}>
                        <Icon type="edit" />
                    </button>
                </div>
            )}

            {showDeleteDialog && (
                <AreYouSureDialog
                    title="Delete Bug?"
                    text="This cannot be undone."
                    confirmText="Delete"
                    onConfirm={onDeleteConfirm}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </article>
    )
}
