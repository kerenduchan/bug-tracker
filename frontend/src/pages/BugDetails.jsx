import { useState } from 'react'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

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
                    Created at:{' '}
                    {moment(bug.createdAt).format('DD/MM/YYYY [at] h:mm')}
                </div>
                <div className="title">{bug.title}</div>
                <div className="severity">Severity: {bug.severity}</div>
                <div className="description">{bug.description}</div>
            </div>
        </div>
    )
}
