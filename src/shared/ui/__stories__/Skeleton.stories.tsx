import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '../skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[200px]" />,
}

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="size-12 rounded-md" />
      <Skeleton className="h-12 w-24 rounded-md" />
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  ),
}

export const TextBlock: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
}

export const TableRow: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      ))}
    </div>
  ),
}
