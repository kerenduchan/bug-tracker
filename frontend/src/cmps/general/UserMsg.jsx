import { useState } from 'react'
import { eventBusService } from '../../services/event-bus.service.js'
import { useRef } from 'react'
import { useEffect } from 'react'
import { Icon } from './Icon.jsx'

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const timeoutIdRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
            setMsg(msg)
            if (timeoutIdRef.current) {
                timeoutIdRef.current = null
                clearTimeout(timeoutIdRef.current)
            }
            timeoutIdRef.current = setTimeout(onClose, 3000)
        })
        return unsubscribe
    }, [])

    function onClose() {
        setMsg(null)
    }

    if (!msg) return <span></span>
    return (
        <section className={`user-msg ${msg.type}`}>
            <div className="message-text">{msg.txt}</div>
            <button className="btn-close btn-icon-round" onClick={onClose}>
                <Icon type="close" />
            </button>
        </section>
    )
}
