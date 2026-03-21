interface FormButtonProps {
  text: string
  loadingText?: string
  isLoading?: boolean
  type?: 'submit' | 'button'
  onClick?: () => void
  className?: string
}

const FormButton = ({
  text,
  loadingText = 'Loading...',
  isLoading = false,
  type = 'submit',
  onClick,
  className
}: FormButtonProps) => {
  const defaultClassName = "w-full bg-custom-secondary-accent text-black rounded py-2 px-4 font-medium hover:bg-custom-secondary-accent/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-custom-accent"

  return (
    <button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={className || defaultClassName}
    >
      {isLoading ? loadingText : text}
    </button>
  )
}

export default FormButton