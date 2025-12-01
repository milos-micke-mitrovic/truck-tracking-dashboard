import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MultiSelect } from '../multi-select'

const meta: Meta<typeof MultiSelect> = {
  title: 'Primitives/MultiSelect',
  component: MultiSelect,
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
type Story = StoryObj<typeof MultiSelect>

const tagOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
]

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'moderator', label: 'Moderator' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        placeholder="Select frameworks"
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        label="Frameworks"
        placeholder="Select frameworks"
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        label="Roles"
        placeholder="Select roles"
        helperText="Select one or more roles for this user"
        options={roleOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        label="Frameworks"
        placeholder="Select frameworks"
        error="Please select at least one framework"
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithPreselected: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react', 'next'])
    return (
      <MultiSelect
        label="Frameworks"
        placeholder="Select frameworks"
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react', 'vue', 'svelte'])
    return (
      <MultiSelect
        label="Frameworks"
        placeholder="Select frameworks"
        clearable
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithMaxDisplay: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react', 'vue', 'angular', 'svelte', 'next'])
    return (
      <MultiSelect
        label="Frameworks (max 2 displayed)"
        placeholder="Select frameworks"
        maxDisplay={2}
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <MultiSelect
      label="Frameworks"
      placeholder="Select frameworks"
      options={tagOptions}
      value={['react', 'vue']}
      disabled
    />
  ),
}

export const NotSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        label="Roles"
        placeholder="Select roles"
        searchable={false}
        options={roleOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const FullFeatured: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultiSelect
        label="Frameworks"
        placeholder="Select frameworks"
        helperText="Choose all that apply"
        searchable
        clearable
        maxDisplay={3}
        options={tagOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}
