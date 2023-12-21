import { useField } from 'formik'
import { FormLabel } from '../FormLabel'

export function FormikTextArea({ label, required, ...props }) {
    const [field, meta] = useField(props)

    function isError() {
        return meta.touched && meta.error
    }

    return (
        <div className={`formik-textarea ${isError() ? 'error' : ''}`}>
            <FormLabel
                htmlFor={props.id || props.name}
                label={label}
                required={required}
            />
            <textarea {...field} {...props} />
            {isError() && <div className="error-msg">{meta.error}</div>}
        </div>
    )
}
