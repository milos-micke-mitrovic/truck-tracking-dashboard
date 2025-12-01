import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Search, Mail, User } from 'lucide-react'
import { Input } from '../input'

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helperText: 'This will be your public display name',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
}

export const WithPrefixIcon: Story = {
  args: {
    placeholder: 'Search...',
    prefixIcon: <Search />,
  },
}

export const WithSuffixIcon: Story = {
  args: {
    placeholder: 'Enter email',
    suffixIcon: <Mail />,
  },
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('Some text to clear')
    return (
      <Input
        placeholder="Type something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        clearable
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    value: 'Disabled value',
    disabled: true,
  },
}

export const WithDebounce: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [debouncedValue, setDebouncedValue] = useState('')

    return (
      <div className="space-y-4">
        <Input
          label="Search (300ms debounce)"
          placeholder="Type to search..."
          prefixIcon={<Search />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          debounce={300}
          onDebounceChange={setDebouncedValue}
        />
        <div className="text-sm text-muted-foreground">
          <p>Immediate value: {value}</p>
          <p>Debounced value: {debouncedValue}</p>
        </div>
      </div>
    )
  },
}

export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Input
        label="Full Featured Input"
        placeholder="Enter your name"
        helperText="Your full legal name"
        prefixIcon={<User />}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        clearable
      />
    )
  },
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Text" type="text" placeholder="Plain text" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Input label="Number" type="number" placeholder="42" />
      <Input label="Tel" type="tel" placeholder="+1 (555) 000-0000" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." prefixIcon={<Search />} />
    </div>
  ),
}
