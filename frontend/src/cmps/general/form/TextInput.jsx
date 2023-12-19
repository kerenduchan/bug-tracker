import { useField } from 'formik'

export function TextInput({ label, ...props }) {
    const [field, meta] = useField(props)

    function isError() {
        return meta.touched && meta.error
    }

    return (
        <div className={`form-field-input ${isError() ? 'error' : ''}`}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props} />
            {isError() && <div className="error-msg">{meta.error}</div>}
        </div>
    )
}
