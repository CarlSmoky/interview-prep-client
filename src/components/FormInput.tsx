interface FormInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const FormInput = ({ id, label, value, onChange, placeholder }: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-custom-secondary-dark text-white border border-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-custom-accent"
      />
    </div>
  )
}

export default FormInput
