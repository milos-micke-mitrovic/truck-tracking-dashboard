import { useState, useEffect, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/shared/utils'

type AutocompleteOption = {
  value: string
  label: string
}

type AutocompleteInputProps = {
  value: string
  onChange: (value: string) => void
  options: AutocompleteOption[]
  onSearchChange?: (query: string) => void
  onLabelChange?: (label: string) => void
  placeholder?: string
  creatable?: boolean
  disabled?: boolean
  initialLabel?: string
}

function AutocompleteInput({
  value,
  onChange,
  options,
  onSearchChange,
  onLabelChange,
  placeholder,
  creatable = false,
  disabled = false,
  initialLabel,
}: AutocompleteInputProps) {
  const [inputText, setInputText] = useState('')
  const [selectedLabel, setSelectedLabel] = useState<string | null>(initialLabel ?? null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync selectedLabel when initialLabel changes externally (edit mode / form reset)
  useEffect(() => {
    if (initialLabel !== undefined) {
      setSelectedLabel(initialLabel || null)
    }
  }, [initialLabel])

  // When value is cleared externally (form reset), reset internal state
  useEffect(() => {
    if (!value) {
      setInputText('')
      setSelectedLabel(null)
    }
  }, [value])

  const displayText = selectedLabel !== null ? selectedLabel : inputText

  const showCreateOption =
    creatable &&
    inputText.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === inputText.trim().toLowerCase())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputText(text)
    setSelectedLabel(null)
    onSearchChange?.(text)
    // Store typed text as the value (for inline creation path)
    onChange(text)
    onLabelChange?.(text)
    setOpen(text.length >= 2)
  }

  const handleSelect = (option: AutocompleteOption) => {
    onChange(option.value)
    setSelectedLabel(option.label)
    onLabelChange?.(option.label)
    setInputText('')
    onSearchChange?.('')
    setOpen(false)
  }

  const handleCreate = () => {
    const text = inputText.trim()
    onChange(text)
    onLabelChange?.(text)
    setSelectedLabel(null)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange('')
    onLabelChange?.('')
    setInputText('')
    setSelectedLabel(null)
    onSearchChange?.('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    if (inputText.length >= 2 && (options.length > 0 || showCreateOption)) {
      setOpen(true)
    }
  }

  const handleBlur = () => {
    // Small delay to allow click on suggestion items to register first
    setTimeout(() => setOpen(false), 150)
  }

  const hasValue = selectedLabel !== null || value !== ''

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'placeholder:text-muted-foreground md:text-sm',
            disabled && 'cursor-not-allowed opacity-50',
            hasValue && 'pr-8'
          )}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onMouseDown={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (options.length > 0 || showCreateOption) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-left truncate"
            >
              {option.label}
            </button>
          ))}
          {showCreateOption && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCreate}
              className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <Plus className="size-3.5 shrink-0" />
              <span className="truncate">Add: {inputText.trim()}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { AutocompleteInput, type AutocompleteInputProps, type AutocompleteOption }
