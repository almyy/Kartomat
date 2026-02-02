import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600/70 hover:bg-indigo-600/90 text-white border-white/20 dark:bg-indigo-600/70 dark:hover:bg-indigo-600/90 dark:border-white/20',
  secondary: 'bg-white/10 hover:bg-white/20 border-white/20 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20',
  danger: 'bg-red-500/70 hover:bg-red-500/90 text-white border-0 dark:bg-red-500/70 dark:hover:bg-red-500/90',
  success: 'bg-green-500/70 hover:bg-green-500/90 text-white border-white/20 dark:bg-green-500/70 dark:hover:bg-green-500/90 dark:border-white/20'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-4 py-2 text-sm sm:text-base',
  lg: 'px-4 py-3 sm:py-4 text-base sm:text-lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    className = '', 
    disabled = false,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'rounded border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const widthClass = fullWidth ? 'w-full' : ''
    
    const buttonClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClass,
      className
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
