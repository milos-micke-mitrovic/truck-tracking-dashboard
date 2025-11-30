import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Label } from '@/shared/ui/primitives/label'
import { BodySmall, Muted } from '@/shared/ui/typography'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/overlay/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/overlay/command'

type Option = {
  value: string
  label: string
  disabled?: boolean
}

type FormSelectProps = {
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
  name?: string
  id?: string
}

function FormSelect({
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
  name,
  id,
}: FormSelectProps) {
  const [open, setOpen] = useState(false)
  const selectId = id || name

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={selectId} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}

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
              'border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              error && 'border-destructive ring-destructive/20',
              !selectedOption && 'text-muted-foreground'
            )}
          >
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                    {value === option.value && (
                      <Check className="ml-auto size-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <BodySmall id={`${selectId}-error`} className="text-destructive">
          {error}
        </BodySmall>
      )}

      {helperText && !error && (
        <Muted id={`${selectId}-helper`}>{helperText}</Muted>
      )}
    </div>
  )
}

export { FormSelect, type Option as FormSelectOption }
