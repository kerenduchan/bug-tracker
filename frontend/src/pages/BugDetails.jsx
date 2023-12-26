import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { utilService } from '../services/util.service'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { LoginContext } from '../contexts/LoginContext.js'
import { FieldList } from '../cmps/general/FieldList.jsx'
import { BugLabels } from '../cmps/bug/BugLabels.jsx'
import { commentService } from '../services/comment.service.js'
import { BugComments } from '../cmps/bug/comment/BugComments.jsx'
import { AreYouSureDialog } from '../cmps/general/AreYouSureDialog.jsx'

export function BugDetails() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { loggedinUser } = useContext(LoginContext)
    const [bug, setBug] = useState(null)
    const [comments, setComments] = useState(null)
    const { bugId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [])

    function onEdit() {
        navigate(`/bug/edit/${bugId}`)
    }

    async function onDeleteConfirm() {
        setShowDeleteDialog(false)

        try {
            await bugService.remove(bugId)
            navigate(`/bug`)
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.error('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onCreateComment(comment) {
        comment.bugId = bugId
        try {
            await commentService.save(comment)
            loadBug()
        } catch (err) {
            console.error(err)
        }
    }

    async function onDeleteComment(commentId) {
        try {
            await commentService.remove(commentId)
            loadBug()
        } catch (err) {
            console.error(err)
        }
    }

    async function onEditComment(comment) {
        try {
            await commentService.save(comment)
            loadBug()
        } catch (err) {
            console.error(err)
        }
    }

    function isDeleteOrEditBugAllowed() {
        return bugService.isDeleteOrEditBugAllowed(loggedinUser, bug)
    }

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)

            const comments = await commentService.query(
                { bugId: bugId },
                { sortBy: 'createdAt', sortDir: -1 }
            )
            setBug(bug)
            setComments(comments.data)
        } catch (err) {
            console.error(err)
            showErrorMsg(err.response.data)
        }
    }

    function getFields() {
        if (!bug) return []

        return [
            {
                label: 'Title',
                value: bug.title,
            },
            {
                label: 'Created at',
                value: utilService.formatDateTimeFull(bug.createdAt),
            },
            {
                label: 'Created by',
                value: `${bug.creator.fullname} (${bug.creator.username})`,
            },
            {
                label: 'Severity',
                value: bug.severity,
            },
            {
                label: 'Description',
                value: <pre>{bug.description}</pre>,
            },
            {
                label: 'Labels',
                value: <BugLabels labels={bug.labels} />,
            },
        ]
    }

    if (!bug || !comments) return <h1>Loading....</h1>
    return (
        <div className="bug-details">
            <div className="header">
                <Link to="/bug">Back to List</Link>
            </div>
            <div className="main">
                <h1>Bug Details</h1>
                <FieldList fields={getFields()} />

                {isDeleteOrEditBugAllowed() && (
                    <div className="actions">
                        <button
                            className="btn-primary btn-edit"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="btn-secondary btn-delete"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete
                        </button>
                    </div>
                )}

                <BugComments
                    comments={comments}
                    onCreate={onCreateComment}
                    onDelete={onDeleteComment}
                    onEdit={onEditComment}
                />
            </div>

            {showDeleteDialog && (
                <AreYouSureDialog
                    title="Delete Bug?"
                    text="This cannot be undone."
                    confirmText="Delete"
                    onConfirm={onDeleteConfirm}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </div>
    )
}
