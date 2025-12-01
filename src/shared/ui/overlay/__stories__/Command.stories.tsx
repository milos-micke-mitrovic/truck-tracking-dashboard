import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../command'
import { Button } from '@/shared/ui/primitives/button'
import {
  CalendarIcon,
  SmileIcon,
  CalculatorIcon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
} from 'lucide-react'

const meta: Meta<typeof Command> = {
  title: 'Overlay/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[350px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            <span>Profile</span>
            <CommandShortcut>Ctrl+P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Billing</span>
            <CommandShortcut>Ctrl+B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Settings</span>
            <CommandShortcut>Ctrl+S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const InDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          Open Command Palette
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Press Ctrl+K to open
        </p>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => setOpen(false)}>
                <CalendarIcon />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <SmileIcon />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <CalculatorIcon />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => setOpen(false)}>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>Ctrl+P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <CreditCardIcon />
                <span>Billing</span>
                <CommandShortcut>Ctrl+B</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>Ctrl+S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}

export const WithDisabledItems: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[350px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <span>Create new file</span>
          </CommandItem>
          <CommandItem>
            <span>Open file</span>
          </CommandItem>
          <CommandItem disabled>
            <span>Save (no changes)</span>
          </CommandItem>
          <CommandItem disabled>
            <span>Export (requires premium)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const Empty: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[350px]">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-4">
            <SmileIcon className="size-8 text-muted-foreground" />
            <p>No results found</p>
            <p className="text-xs text-muted-foreground">
              Try a different search term
            </p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  ),
}
