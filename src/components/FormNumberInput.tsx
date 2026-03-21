interface FormNumberInputProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  placeholder?: string
}

const FormNumberInput = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  placeholder
}: FormNumberInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm">{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full bg-transparent border border-white rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-custom-accent"
      />
    </div>
  )
}

export default FormNumberInput