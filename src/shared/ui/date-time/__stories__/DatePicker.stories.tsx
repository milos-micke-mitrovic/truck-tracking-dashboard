import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DatePicker } from '../date-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'Date & Time/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>()
    return (
      <DatePicker
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
        placeholder="DD/MM/YYYY"
      />
    )
  },
}

export const TypeDirectly: Story = {
  name: 'Type Date Directly',
  render: () => {
    const [date, setDate] = useState<string | undefined>()
    return (
      <div className="space-y-2">
        <DatePicker
          label="Birth Date"
          value={date}
          onChange={(d) => setDate(d as string | undefined)}
          helperText="Type DD/MM/YYYY or use calendar"
        />
        <p className="text-muted-foreground text-xs">
          Value: {date || '(none)'}
        </p>
      </div>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>()
    return (
      <DatePicker
        label="Birth Date"
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
      />
    )
  },
}

export const WithValue: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>('2024-06-15')
    return (
      <DatePicker
        label="Event Date"
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
      />
    )
  },
}

export const HistoricalDate: Story = {
  name: 'Historical Date (e.g., 1973)',
  render: () => {
    const [date, setDate] = useState<string | undefined>('1973-05-20')
    return (
      <div className="space-y-2">
        <DatePicker
          label="Birth Date"
          value={date}
          onChange={(d) => setDate(d as string | undefined)}
          helperText="Use year dropdown or type directly"
        />
        <p className="text-muted-foreground text-xs">
          Calendar has year dropdown (100 years back)
        </p>
      </div>
    )
  },
}

export const WithMinMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>()
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    return (
      <DatePicker
        label="Select Date (Next Month Only)"
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
        minDate={today}
        maxDate={nextMonth}
        helperText="Only dates within the next month are selectable"
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>()
    return (
      <DatePicker
        label="Required Date"
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
        error="This field is required"
        required
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <DatePicker
      label="Disabled Date"
      value="2024-01-15"
      disabled
    />
  ),
}

export const NotClearable: Story = {
  render: () => {
    const [date, setDate] = useState<string | undefined>('2024-06-15')
    return (
      <DatePicker
        label="Non-clearable"
        value={date}
        onChange={(d) => setDate(d as string | undefined)}
        clearable={false}
      />
    )
  },
}
