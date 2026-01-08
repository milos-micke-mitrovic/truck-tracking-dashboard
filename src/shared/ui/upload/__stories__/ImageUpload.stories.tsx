import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ImageUpload } from '../image-upload'

const meta: Meta<typeof ImageUpload> = {
  title: 'Upload/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ImageUpload>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithPreview: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
    )
    return (
      <ImageUpload
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        size="sm"
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Large: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        size="lg"
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        value={value}
        onChange={setValue}
        label="Profile Photo"
      />
    )
  },
}

export const WithHint: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        value={value}
        onChange={setValue}
        hint="PNG, JPG up to 2MB"
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <ImageUpload
        value={value}
        onChange={setValue}
        error="Image is required"
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <ImageUpload
      disabled
    />
  ),
}
