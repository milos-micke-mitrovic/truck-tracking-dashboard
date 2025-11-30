import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import { Label } from '@/shared/ui/primitives/label'
import { BodySmall, Muted } from '@/shared/ui/typography'

type FormTextareaProps = React.ComponentProps<'textarea'> & {
  label?: string
  helperText?: string
  error?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, helperText, error, disabled, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(error && 'text-destructive')}
          >
            {label}
          </Label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          className={cn(
            'border-input placeholder:text-muted-foreground min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className
          )}
          {...props}
        />

        {error && (
          <BodySmall id={`${textareaId}-error`} className="text-destructive">
            {error}
          </BodySmall>
        )}

        {helperText && !error && (
          <Muted id={`${textareaId}-helper`}>{helperText}</Muted>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export { FormTextarea }
