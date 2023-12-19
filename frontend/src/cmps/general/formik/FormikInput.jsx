import { useField } from 'formik'

export function FormikInput({ label, ...props }) {
    const [field, meta] = useField(props)

    function isError() {
        return meta.touched && meta.error
    }

    return (
        <div className={`formik-input ${isError() ? 'error' : ''}`}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props} />
            {isError() && <div className="error-msg">{meta.error}</div>}
        </div>
    )
}
