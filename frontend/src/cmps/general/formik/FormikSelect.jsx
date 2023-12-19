import { useField } from 'formik'

export function FormikSelect({ label, ...props }) {
    const [field, meta] = useField(props)
    return (
        <div className="formik-select">
            <label htmlFor={props.id || props.name}>{label}</label>
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
