import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../badge'

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
}

export const WithNumbers: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="default">99+</Badge>
      <Badge variant="secondary">12</Badge>
      <Badge variant="destructive">3</Badge>
      <Badge variant="outline">0</Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Order Status:</span>
        <Badge variant="default">Completed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">User Role:</span>
        <Badge variant="secondary">Admin</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Payment:</span>
        <Badge variant="destructive">Failed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Document:</span>
        <Badge variant="outline">Draft</Badge>
      </div>
    </div>
  ),
}

export const TagsList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">React</Badge>
      <Badge variant="secondary">TypeScript</Badge>
      <Badge variant="secondary">Tailwind CSS</Badge>
      <Badge variant="secondary">Storybook</Badge>
      <Badge variant="secondary">Vite</Badge>
    </div>
  ),
}
