import { forwardRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/shared/utils'
import { Checkbox } from '@/shared/ui/primitives/checkbox'
import { Label } from '@/shared/ui/primitives/label'
import { BodySmall, Muted } from '@/shared/ui/typography'

type FormCheckboxProps = Omit<
  React.ComponentProps<typeof CheckboxPrimitive.Root>,
  'onChange'
> & {
  label?: string
  description?: string
  error?: string
  onChange?: (checked: boolean) => void
}

const FormCheckbox = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  FormCheckboxProps
>(
  (
    { className, label, description, error, disabled, id, onChange, ...props },
    ref
  ) => {
    const checkboxId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Checkbox
            ref={ref}
            id={checkboxId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                onChange?.(checked)
              }
            }}
            className={cn(error && 'border-destructive', className)}
            {...props}
          />
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <Label
                  htmlFor={checkboxId}
                  className={cn(
                    'cursor-pointer leading-tight',
                    error && 'text-destructive'
                  )}
                >
                  {label}
                </Label>
              )}
              {description && <Muted>{description}</Muted>}
            </div>
          )}
        </div>

        {error && (
          <BodySmall id={`${checkboxId}-error`} className="text-destructive">
            {error}
          </BodySmall>
        )}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'

export { FormCheckbox }
