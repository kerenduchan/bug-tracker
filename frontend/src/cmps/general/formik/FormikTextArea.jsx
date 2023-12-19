import { useField } from 'formik'

export function FormikTextArea({ label, ...props }) {
    const [field, meta] = useField(props)

    function isError() {
        return meta.touched && meta.error
    }

    return (
        <div className={`formik-textarea ${isError() ? 'error' : ''}`}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea {...field} {...props} />
            {isError() && <div className="error-msg">{meta.error}</div>}
        </div>
    )
}
