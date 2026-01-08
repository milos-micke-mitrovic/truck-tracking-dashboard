import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mail, Plus, Trash2, Settings } from 'lucide-react'
import { Button, IconButton } from '../button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithPrefixIcon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button prefixIcon={<Mail />}>Login with Email</Button>
      <Button variant="secondary" prefixIcon={<Plus />}>
        Add Item
      </Button>
      <Button variant="destructive" prefixIcon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
}

export const WithSuffixIcon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button suffixIcon={<Settings />}>Settings</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button loading>Loading</Button>
      <Button loading variant="secondary">
        Processing
      </Button>
      <Button loading variant="outline">
        Please wait
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">
        Disabled
      </Button>
      <Button disabled variant="outline">
        Disabled
      </Button>
    </div>
  ),
}

// IconButton stories
export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Plus />} aria-label="Add" size="sm" />
      <IconButton icon={<Plus />} aria-label="Add" />
      <IconButton icon={<Plus />} aria-label="Add" size="lg" />
    </div>
  ),
}

export const IconButtonVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Settings />} aria-label="Settings" variant="default" />
      <IconButton
        icon={<Settings />}
        aria-label="Settings"
        variant="secondary"
      />
      <IconButton icon={<Settings />} aria-label="Settings" variant="outline" />
      <IconButton icon={<Settings />} aria-label="Settings" variant="ghost" />
      <IconButton icon={<Trash2 />} aria-label="Delete" variant="destructive" />
    </div>
  ),
}

export const IconButtonSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Plus />} aria-label="Add" size="xs" />
      <IconButton icon={<Plus />} aria-label="Add" size="sm" />
      <IconButton icon={<Plus />} aria-label="Add" size="default" />
      <IconButton icon={<Plus />} aria-label="Add" size="lg" />
    </div>
  ),
}
