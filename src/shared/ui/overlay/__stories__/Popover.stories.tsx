import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverTrigger, PopoverContent } from '../popover'
import { Button } from '../../button'
import { Input } from '../../input'

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">This is the popover content.</p>
      </PopoverContent>
    </Popover>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Dimensions</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Width" defaultValue="100%" />
            <Input label="Height" defaultValue="auto" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Content on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Content on right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Content on bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Content on left</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Align Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Aligned to start</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Align Center</Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <p className="text-sm">Aligned to center</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Align End</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm">Aligned to end</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const WithRichContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>View Details</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted size-10 rounded-full" />
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-muted-foreground text-xs">john@example.com</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <p className="text-muted-foreground text-xs">
              Member since January 2024
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
