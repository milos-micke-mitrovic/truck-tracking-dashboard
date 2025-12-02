'use client'

import * as React from 'react'
import { forwardRef, useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'

import { cn } from '@/shared/utils'
import { IconButton } from './button'
import { Label } from './label'
import { Caption } from '../typography'

const inputStyles = cn(
  'border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
)

type InputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label?: string
  helperText?: string
  error?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local'
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  debounce?: number
  onDebounceChange?: (value: string) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      prefixIcon,
      suffixIcon,
      clearable,
      onClear,
      debounce,
      onDebounceChange,
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // For controlled inputs, use the value directly
    // For uncontrolled with debounce, we need internal state
    const isControlled = value !== undefined
    const displayValue = isControlled ? value : undefined

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    const inputId = id || props.name

    // Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      // Always call onChange immediately
      onChange?.(e)

      // Handle debounced callback
      if (debounce && onDebounceChange) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          onDebounceChange(newValue)
        }, debounce)
      }
    }

    const handleClear = () => {
      onClear?.()

      // Trigger onChange with empty value
      if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }

      // Trigger debounced callback immediately on clear
      if (debounce && onDebounceChange) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        onDebounceChange('')
      }
    }

    const currentValue = displayValue ?? ''
    const showClearButton =
      clearable && String(currentValue).length > 0 && !disabled
    const hasRightElement = suffixIcon || isPassword || showClearButton

    const inputElement = (
      <div className="relative">
        {prefixIcon && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-4">
            {prefixIcon}
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
          value={displayValue}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          className={cn(
            inputStyles,
            prefixIcon && 'pl-10',
            hasRightElement && 'pr-10',
            (type === 'time' || type === 'date' || type === 'datetime-local') && 'w-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer',
            className
          )}
          {...props}
        />

        {isPassword && (
          <IconButton
            type="button"
            variant="ghost"
            size="xs"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            icon={showPassword ? <EyeOff /> : <Eye />}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          />
        )}

        {showClearButton && !isPassword && (
          <IconButton
            type="button"
            variant="ghost"
            size="xs"
            tabIndex={-1}
            onClick={handleClear}
            icon={<X />}
            aria-label="Clear input"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          />
        )}

        {suffixIcon && !isPassword && !showClearButton && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4">
            {suffixIcon}
          </div>
        )}
      </div>
    )

    // If no form field props, return just the input
    if (!label && !helperText && !error) {
      return inputElement
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
            {label}
          </Label>
        )}

        {inputElement}

        {error && (
          <Caption id={`${inputId}-error`} color="error">
            {error}
          </Caption>
        )}

        {helperText && !error && (
          <Caption id={`${inputId}-helper`}>{helperText}</Caption>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
