export function FormSelect({ name, title, value, onChange, options }) {
    return (
        <>
            <label htmlFor={name}>{title}</label>
            <select id={name} name={name} value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.text} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
        </>
    )
}
