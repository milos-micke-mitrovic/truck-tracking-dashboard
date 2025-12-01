import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from '../checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Checkbox checked={checked} onChange={setChecked} />
  },
}

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label="Accept terms and conditions"
        checked={checked}
        onChange={setChecked}
      />
    )
  },
}

export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label="Marketing emails"
        description="Receive emails about new products, features, and more."
        checked={checked}
        onChange={setChecked}
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label="Accept terms and conditions"
        error="You must accept the terms to continue"
        checked={checked}
        onChange={setChecked}
      />
    )
  },
}

export const Checked: Story = {
  render: () => <Checkbox label="This is checked" checked />,
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled checked />
    </div>
  ),
}

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['email'])

    const toggle = (value: string) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      )
    }

    return (
      <div className="space-y-3">
        <Checkbox
          label="Email notifications"
          description="Get notified via email"
          checked={selected.includes('email')}
          onChange={() => toggle('email')}
        />
        <Checkbox
          label="SMS notifications"
          description="Get notified via SMS"
          checked={selected.includes('sms')}
          onChange={() => toggle('sms')}
        />
        <Checkbox
          label="Push notifications"
          description="Get notified on your device"
          checked={selected.includes('push')}
          onChange={() => toggle('push')}
        />
      </div>
    )
  },
}
