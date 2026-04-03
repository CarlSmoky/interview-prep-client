import Button from './Button'

interface FormButtonProps {
  text: string
  loadingText?: string
  isLoading?: boolean
  disabled?: boolean
  type?: 'submit' | 'button'
  onClick?: () => void
  className?: string
  variant?: 'filled' | 'outline'
}

const FormButton = ({
  text,
  loadingText = 'Loading...',
  isLoading = false,
  disabled = false,
  type = 'submit',
  onClick,
  className,
  variant = 'filled',
}: FormButtonProps) => (
  <Button
    type={type}
    onClick={onClick}
    disabled={isLoading || disabled}
    variant={variant}
    className={className}
  >
    {isLoading ? loadingText : text}
  </Button>
)

export default FormButton