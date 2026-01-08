import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { TimePicker } from '../time-picker'

const meta: Meta<typeof TimePicker> = {
  title: 'Date & Time/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <TimePicker
        value={time}
        onChange={setTime}
      />
    )
  },
}

export const TypeExactTime: Story = {
  name: 'Type Exact Time (e.g., 12:34)',
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <div className="space-y-2">
        <TimePicker
          label="Type or select time"
          value={time}
          onChange={setTime}
          helperText="Type any time like 12:34 or select from dropdown"
        />
        <p className="text-muted-foreground text-xs">
          Current value: {time || '(none)'}
        </p>
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <TimePicker
        label="Appointment Time"
        value={time}
        onChange={setTime}
        placeholder="Choose a time"
      />
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>('09:30')
    return (
      <TimePicker
        label="Meeting Time"
        value={time}
        onChange={setTime}
      />
    )
  },
}

export const Step5Minutes: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <TimePicker
        label="Time (5 min intervals)"
        value={time}
        onChange={setTime}
        step={5}
      />
    )
  },
}

export const Step30Minutes: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <TimePicker
        label="Time (30 min intervals)"
        value={time}
        onChange={setTime}
        step={30}
      />
    )
  },
}

export const TwelveHourFormat: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>('14:30')
    return (
      <TimePicker
        label="12-Hour Format"
        value={time}
        onChange={setTime}
        use24Hour={false}
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>()
    return (
      <TimePicker
        label="Required Time"
        value={time}
        onChange={setTime}
        error="Please select a time"
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <TimePicker
      label="Disabled Time"
      value="10:00"
      disabled
    />
  ),
}

export const Clearable: Story = {
  render: () => {
    const [time, setTime] = useState<string | undefined>('15:45')
    return (
      <TimePicker
        label="Clearable Time"
        value={time}
        onChange={setTime}
        clearable
      />
    )
  },
}
