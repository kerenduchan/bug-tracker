import { useField } from 'formik'
import { FormLabel } from '../FormLabel'

export function FormikInput({ label, required, ...props }) {
    const [field, meta] = useField(props)

    function isError() {
        return meta.touched && meta.error
    }

    return (
        <div className={`formik-input ${isError() ? 'error' : ''}`}>
            <FormLabel
                htmlFor={props.id || props.name}
                label={label}
                required={required}
            />
            <input {...field} {...props} />
            {isError() && <div className="error-msg">{meta.error}</div>}
        </div>
    )
}
