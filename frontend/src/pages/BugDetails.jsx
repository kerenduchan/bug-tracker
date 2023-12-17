import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { utilService } from '../services/util.service'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { FieldList } from '../cmps/general/FieldList.jsx'

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

    function getFields() {
        if (!bug) return []

        return [
            {
                label: 'Title',
                value: bug.title,
            },
            {
                label: 'Created at',
                value: utilService.formatDateTime(bug.createdAt),
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
                value: bug.description,
            },
        ]
    }

    if (!bug) return <h1>Loading....</h1>
    return (
        <div className="bug-details">
            <div className="header">
                <Link to="/bug">Back to List</Link>
            </div>
            <div className="main">
                <h1>Bug Details</h1>
                <FieldList fields={getFields()} />
            </div>
        </div>
    )
}
