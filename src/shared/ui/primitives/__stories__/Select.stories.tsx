import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Select } from '../select'

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    searchable: { control: 'boolean' },
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
type Story = StoryObj<typeof Select>

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        placeholder="Select a country"
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        label="Country"
        placeholder="Select a country"
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        label="Status"
        placeholder="Select status"
        helperText="Choose the current status of the item"
        options={statusOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        label="Country"
        placeholder="Select a country"
        error="Please select a country"
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        label="Country"
        placeholder="Select a country"
        searchable
        searchPlaceholder="Search countries..."
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('us')
    return (
      <Select
        label="Country"
        placeholder="Select a country"
        clearable
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Select
      label="Country"
      placeholder="Select a country"
      options={countryOptions}
      value="us"
      disabled
    />
  ),
}

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const optionsWithDisabled = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive', disabled: true },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived', disabled: true },
    ]
    return (
      <Select
        label="Status"
        placeholder="Select status"
        options={optionsWithDisabled}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const FullFeatured: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select
        label="Country"
        placeholder="Select a country"
        helperText="Where are you located?"
        searchable
        clearable
        options={countryOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}
