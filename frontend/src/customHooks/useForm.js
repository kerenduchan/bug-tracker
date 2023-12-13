import { useEffect, useState } from 'react'

export function useForm(initialState, callBack) {
    const [fields, setFields] = useState(initialState)

    useEffect(() => {
        if (callBack) callBack(fields)
    }, [fields])

    function handleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
                value = +value || ''
                break
            case 'range':
                value = +value
                break
            case 'checkbox':
                value = target.checked
            default:
                break
        }
        setFields((prevFields) => ({ ...prevFields, [field]: value }))
    }

    return [fields, handleChange, setFields]
}
