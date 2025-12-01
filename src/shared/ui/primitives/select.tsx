'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

import { cn } from '@/shared/utils'
import { IconButton } from './button'
import { Label } from './label'
import { BodySmall, Muted } from '../typography'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../overlay/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../overlay/command'

type Option = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  searchable?: boolean
  clearable?: boolean
  name?: string
  id?: string
  className?: string
}

function Select({
  label,
  helperText,
  error,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  options,
  value,
  onChange,
  disabled,
  searchable = false,
  clearable = false,
  name,
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const selectId = id || name

  const selectedOption = options.find((opt) => opt.value === value)
  const showClearButton = clearable && value && !disabled

  const selectElement = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-invalid={!!error}
          disabled={disabled}
          className={cn(
            'border-input flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            error && 'border-destructive ring-destructive/20',
            !selectedOption && 'text-muted-foreground'
          )}
        >
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {showClearButton && (
              <IconButton
                type="button"
                variant="ghost"
                size="xs"
                icon={<X />}
                aria-label="Clear selection"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange?.('')
                }}
                className="text-muted-foreground hover:text-foreground"
              />
            )}
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="!w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          {searchable && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check className="ml-auto size-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // If no form field props, return just the select
  if (!label && !helperText && !error) {
    return <div className={className}>{selectElement}</div>
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={selectId} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}

      {selectElement}

      {error && (
        <BodySmall id={`${selectId}-error`} color="error">
          {error}
        </BodySmall>
      )}

      {helperText && !error && (
        <Muted id={`${selectId}-helper`}>{helperText}</Muted>
      )}
    </div>
  )
}

export { Select, type Option as SelectOption }
