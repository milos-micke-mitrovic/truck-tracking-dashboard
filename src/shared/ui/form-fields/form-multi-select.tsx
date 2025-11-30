import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Label } from '@/shared/ui/primitives/label'
import { Badge } from '@/shared/ui/primitives/badge'
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

type FormMultiSelectProps = {
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  options: Option[]
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
  searchable?: boolean
  name?: string
  id?: string
  maxDisplay?: number
}

function FormMultiSelect({
  label,
  helperText,
  error,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  options,
  value = [],
  onChange,
  disabled,
  searchable = true,
  name,
  id,
  maxDisplay = 3,
}: FormMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selectId = id || name

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange?.(newValue)
  }

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(value.filter((v) => v !== optionValue))
  }

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
              'border-input flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1.5 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              error && 'border-destructive ring-destructive/20'
            )}
          >
            <div className="flex flex-1 flex-wrap gap-1">
              {selectedOptions.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selectedOptions.slice(0, maxDisplay).map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="truncate">{option.label}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="hover:bg-muted rounded"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {selectedOptions.length > maxDisplay && (
                <Badge variant="secondary">
                  +{selectedOptions.length - maxDisplay}
                </Badge>
              )}
            </div>
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
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                        value.includes(option.value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}
                    >
                      {value.includes(option.value) && (
                        <Check className="size-3" />
                      )}
                    </div>
                    <span className="truncate">{option.label}</span>
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

export { FormMultiSelect, type Option as FormMultiSelectOption }
