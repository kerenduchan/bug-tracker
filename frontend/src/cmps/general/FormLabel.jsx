export function FormLabel({ htmlFor, label, required }) {
    return (
        <label className="form-label" htmlFor={htmlFor}>
            {label} {required && <span className="required-field-marker" />}
        </label>
    )
}
