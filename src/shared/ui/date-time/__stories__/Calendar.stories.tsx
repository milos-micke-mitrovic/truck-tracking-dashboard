import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Calendar } from '../calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Date & Time/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    )
  },
}

export const WithRange: Story = {
  render: () => {
    const [range, setRange] = useState<{
      from: Date | undefined
      to: Date | undefined
    }>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={(r) => setRange(r as { from: Date | undefined; to: Date | undefined })}
        className="rounded-md border"
      />
    )
  },
}

export const DisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const today = new Date()
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) => date < today}
        className="rounded-md border"
      />
    )
  },
}
