import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RadioGroup } from '../radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
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
type Story = StoryObj<typeof RadioGroup>

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const notificationOptions = [
  { value: 'all', label: 'All notifications' },
  { value: 'important', label: 'Important only' },
  { value: 'none', label: 'None' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <RadioGroup options={planOptions} value={value} onChange={setValue} />
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <RadioGroup
        label="Select a plan"
        options={planOptions}
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
      <RadioGroup
        label="Notification preferences"
        helperText="Choose how you want to receive notifications"
        options={notificationOptions}
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
      <RadioGroup
        label="Select a plan"
        error="Please select a plan to continue"
        options={planOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const options = [
      {
        value: 'free',
        label: 'Free',
        description: 'Basic features for personal use',
      },
      {
        value: 'pro',
        label: 'Pro',
        description: 'Advanced features for professionals',
      },
      {
        value: 'enterprise',
        label: 'Enterprise',
        description: 'Full access with dedicated support',
      },
    ]
    return (
      <RadioGroup
        label="Select a plan"
        options={options}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Preselected: Story = {
  render: () => {
    const [value, setValue] = useState('pro')
    return (
      <RadioGroup
        label="Select a plan"
        options={planOptions}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup
      label="Select a plan"
      options={planOptions}
      value="pro"
      disabled
    />
  ),
}

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const options = [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro', disabled: true },
      { value: 'enterprise', label: 'Enterprise' },
    ]
    return (
      <RadioGroup
        label="Select a plan"
        helperText="Pro plan is temporarily unavailable"
        options={options}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const FullFeatured: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const options = [
      {
        value: 'starter',
        label: 'Starter',
        description: 'Up to 5 users, basic analytics',
      },
      {
        value: 'business',
        label: 'Business',
        description: 'Up to 25 users, advanced analytics, priority support',
      },
      {
        value: 'enterprise',
        label: 'Enterprise',
        description: 'Unlimited users, custom integrations, dedicated support',
      },
    ]
    return (
      <RadioGroup
        label="Choose your plan"
        helperText="You can upgrade or downgrade at any time"
        options={options}
        value={value}
        onChange={setValue}
      />
    )
  },
}
