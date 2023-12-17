export function FieldList({ fields }) {
    return (
        <div className="field-list">
            {fields.map((field) => (
                <div key={field.label} className="field">
                    <div className="label">{field.label}:</div>
                    <div className="value">{field.value}</div>
                </div>
            ))}
        </div>
    )
}
