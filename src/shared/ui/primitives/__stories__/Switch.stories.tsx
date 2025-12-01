import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from '../switch'

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
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
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Switch checked={checked} onChange={setChecked} />
  },
}

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        label="Airplane Mode"
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
      <Switch
        label="Dark Mode"
        description="Enable dark mode for the application"
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
      <Switch
        label="Enable notifications"
        error="Notifications are required for this feature"
        checked={checked}
        onChange={setChecked}
      />
    )
  },
}

export const Checked: Story = {
  render: () => <Switch label="This is on" checked />,
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled checked />
    </div>
  ),
}

export const SettingsList: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      marketing: false,
      analytics: true,
      cookies: false,
    })

    const toggle = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
      <div className="w-[320px] space-y-4">
        <Switch
          label="Push Notifications"
          description="Receive push notifications on your device"
          checked={settings.notifications}
          onChange={() => toggle('notifications')}
        />
        <Switch
          label="Marketing Emails"
          description="Receive emails about new features and updates"
          checked={settings.marketing}
          onChange={() => toggle('marketing')}
        />
        <Switch
          label="Analytics"
          description="Help us improve by sending anonymous usage data"
          checked={settings.analytics}
          onChange={() => toggle('analytics')}
        />
        <Switch
          label="Third-party Cookies"
          description="Allow third-party cookies for personalized experience"
          checked={settings.cookies}
          onChange={() => toggle('cookies')}
        />
      </div>
    )
  },
}
