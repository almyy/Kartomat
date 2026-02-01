import { Button as ChakraButton } from '@chakra-ui/react'
import { forwardRef, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  title?: string
  'aria-label'?: string
  type?: 'button' | 'submit' | 'reset'
}

const variantMap: Record<ButtonVariant, { variant: 'solid' | 'subtle' | 'outline' | 'ghost', colorPalette: string }> = {
  primary: { variant: 'solid', colorPalette: 'blue' },
  secondary: { variant: 'subtle', colorPalette: 'gray' },
  danger: { variant: 'solid', colorPalette: 'red' },
  success: { variant: 'solid', colorPalette: 'green' }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    children, 
    ...props 
  }, ref) => {
    const { variant: chakraVariant, colorPalette } = variantMap[variant]
    
    return (
      <ChakraButton
        ref={ref}
        variant={chakraVariant}
        colorPalette={colorPalette}
        size={size}
        width={fullWidth ? 'full' : undefined}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  }
)

Button.displayName = 'Button'
