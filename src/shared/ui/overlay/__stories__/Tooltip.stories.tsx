import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipTrigger, TooltipContent } from '../tooltip'
import { Button } from '@/shared/ui/primitives/button'
import { PlusIcon, TrashIcon, PencilIcon, CopyIcon } from 'lucide-react'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const OnIconButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new item</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <PencilIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <CopyIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <TrashIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithKeyboardShortcut: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Save</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Save changes{' '}
            <kbd className="bg-muted ml-1 rounded px-1">Ctrl+S</kbd>
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Undo</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Undo <kbd className="bg-muted ml-1 rounded px-1">Ctrl+Z</kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const OnText: Story = {
  render: () => (
    <p className="text-sm">
      You can add tooltips to{' '}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help underline decoration-dotted">
            inline text
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This explains the term</p>
        </TooltipContent>
      </Tooltip>{' '}
      as well.
    </p>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled>Disabled Button</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This button is disabled because...</p>
      </TooltipContent>
    </Tooltip>
  ),
}
