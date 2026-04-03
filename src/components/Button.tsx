import { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'filled' | 'outline' | 'danger' | 'ghost'
  disabled?: boolean
  className?: string
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  filled: 'bg-white text-gray-600 hover:bg-white/80',
  outline: 'border border-white text-white hover:bg-white/10',
  danger: 'bg-custom-red text-white hover:bg-custom-red/80',
  ghost: 'text-white hover:bg-white/10',
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'filled',
  disabled = false,
  className,
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={
      className ||
      `flex items-center justify-center gap-2 rounded-full h-14 px-6 font-medium transition-colors w-full
       disabled:opacity-50 disabled:cursor-not-allowed
       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-custom-dark
       ${variantStyles[variant]}`
    }
  >
    {children}
  </button>
)

export default Button