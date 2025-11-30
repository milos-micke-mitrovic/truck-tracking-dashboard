import { forwardRef } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/shared/utils'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group'
import { Label } from '@/shared/ui/primitives/label'

type RadioOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type FormRadioGroupProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>,
  'onChange'
> & {
  label?: string
  helperText?: string
  error?: string
  options: RadioOption[]
  onChange?: (value: string) => void
}

const FormRadioGroup = forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  FormRadioGroupProps
>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      disabled,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const groupId = id || props.name

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label className={cn(error && 'text-destructive')}>{label}</Label>
        )}

        <RadioGroup
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${groupId}-error`
              : helperText
                ? `${groupId}-helper`
                : undefined
          }
          onValueChange={onChange}
          className={className}
          {...props}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start gap-3">
              <RadioGroupItem
                value={option.value}
                id={`${groupId}-${option.value}`}
                disabled={option.disabled}
                className={cn(error && 'border-destructive')}
              />
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor={`${groupId}-${option.value}`}
                  className={cn(
                    'cursor-pointer leading-tight font-normal',
                    error && 'text-destructive'
                  )}
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>

        {error && (
          <p id={`${groupId}-error`} className="text-destructive text-sm">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${groupId}-helper`} className="text-muted-foreground text-sm">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormRadioGroup.displayName = 'FormRadioGroup'

export { FormRadioGroup, type RadioOption as FormRadioOption }
