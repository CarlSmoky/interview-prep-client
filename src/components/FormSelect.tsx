interface FormSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

const FormSelect = ({ id, label, value, onChange, options }: FormSelectProps) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-custom-secondary-dark text-white border border-white rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect