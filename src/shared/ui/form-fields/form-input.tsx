import { forwardRef, useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Label } from '@/shared/ui/primitives/label'
import { BodySmall, Muted } from '@/shared/ui/typography'

type FormInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label?: string
  helperText?: string
  error?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const inputId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
            {label}
          </Label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              'border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}

          {rightIcon && !isPassword && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <BodySmall id={`${inputId}-error`} className="text-destructive">
            {error}
          </BodySmall>
        )}

        {helperText && !error && (
          <Muted id={`${inputId}-helper`}>{helperText}</Muted>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export { FormInput }
