interface FormTextareaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

const FormTextarea = ({ id, label, value, onChange, placeholder }: FormTextareaProps) => {
  return (
    <div className="w-full lg:w-1/2">
      {label && <label htmlFor={id} className="block mb-2 text-sm">{label}</label>}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 lg:h-100 bg-custom-light border border-white rounded px-3 py-2 text-custom-dark resize-y focus:outline-none focus:ring-2 focus:ring-custom-accent"
        placeholder={placeholder}
      />
    </div>
  )
}

export default FormTextarea