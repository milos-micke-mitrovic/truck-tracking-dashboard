import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '../spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {},
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  ),
}

export const CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="text-primary" />
      <Spinner className="text-destructive" />
      <Spinner className="text-muted-foreground" />
    </div>
  ),
}
