import { forwardRef } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/shared/utils'
import { Switch } from '@/shared/ui/primitives/switch'
import { Label } from '@/shared/ui/primitives/label'
import { BodySmall, Muted } from '@/shared/ui/typography'

type FormSwitchProps = Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  'onChange'
> & {
  label?: string
  description?: string
  error?: string
  onChange?: (checked: boolean) => void
}

const FormSwitch = forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  FormSwitchProps
>(
  (
    { className, label, description, error, disabled, id, onChange, ...props },
    ref
  ) => {
    const switchId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Switch
            ref={ref}
            id={switchId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${switchId}-error` : undefined}
            onCheckedChange={onChange}
            className={cn(error && 'border-destructive', className)}
            {...props}
          />
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <Label
                  htmlFor={switchId}
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
          <BodySmall id={`${switchId}-error`} className="text-destructive">
            {error}
          </BodySmall>
        )}
      </div>
    )
  }
)

FormSwitch.displayName = 'FormSwitch'

export { FormSwitch }
