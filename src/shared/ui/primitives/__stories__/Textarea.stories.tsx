import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Textarea } from '../textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
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
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 500 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
    defaultValue: 'Short',
    error: 'Description must be at least 50 characters',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Cannot edit',
    defaultValue: 'This textarea is disabled',
    disabled: true,
  },
}

export const WithRows: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea
        label="Small (3 rows)"
        placeholder="Enter text..."
        rows={3}
      />
      <Textarea
        label="Medium (5 rows)"
        placeholder="Enter text..."
        rows={5}
      />
      <Textarea
        label="Large (8 rows)"
        placeholder="Enter text..."
        rows={8}
      />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const maxLength = 200

    return (
      <div className="space-y-2">
        <Textarea
          label="Message"
          placeholder="Type your message..."
          helperText={`${value.length}/${maxLength} characters`}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          error={value.length >= maxLength ? 'Maximum length reached' : undefined}
        />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Textarea
        label="Default"
        placeholder="Enter text..."
      />
      <Textarea
        label="With value"
        defaultValue="This has some content"
      />
      <Textarea
        label="With error"
        defaultValue="Invalid content"
        error="This field has an error"
      />
      <Textarea
        label="Disabled"
        defaultValue="Disabled content"
        disabled
      />
    </div>
  ),
}
