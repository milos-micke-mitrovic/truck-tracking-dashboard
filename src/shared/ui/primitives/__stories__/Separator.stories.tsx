import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '../separator'

const meta: Meta<typeof Separator> = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Section Title</h4>
        <p className="text-sm text-muted-foreground">
          Description of this section.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Another Section</h4>
        <p className="text-sm text-muted-foreground">
          More content below the separator.
        </p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Home</span>
      <Separator orientation="vertical" />
      <span>Products</span>
      <Separator orientation="vertical" />
      <span>About</span>
    </div>
  ),
}

export const InList: Story = {
  render: () => (
    <div className="w-[200px]">
      <div className="py-2">Item 1</div>
      <Separator />
      <div className="py-2">Item 2</div>
      <Separator />
      <div className="py-2">Item 3</div>
    </div>
  ),
}
