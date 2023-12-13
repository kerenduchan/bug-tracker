import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { utilService } from '../../services/util.service'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)
            setBug(bug)
        } catch (err) {
            console.log(err)
            showErrorMsg(err.response.data)
        }
    }

    if (!bug) return <h1>loadings....</h1>
    return (
        <div className="bug-details">
            <div className="header">
                <Link to="/bug">Back to List</Link>
            </div>
            <div className="main">
                <div className="created-at">
                    Created at: {utilService.formatDateTime(bug.createdAt)}
                </div>
                <div className="title">{bug.title}</div>
                <div className="severity">Severity: {bug.severity}</div>
                <div className="description">{bug.description}</div>
            </div>
        </div>
    )
}
