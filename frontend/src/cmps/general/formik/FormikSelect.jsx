import { useField } from 'formik'
import { FormLabel } from '../FormLabel'

export function FormikSelect({ label, required, ...props }) {
    const [field, meta] = useField(props)
    return (
        <div className="formik-select">
            <FormLabel
                htmlFor={props.id || props.name}
                label={label}
                required={required}
            />
            <select {...field} {...props}>
                {props.options.map((option) => (
                    <option key={option.text} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    )
}
