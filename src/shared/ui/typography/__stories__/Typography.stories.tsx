import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  H1,
  H2,
  H3,
  H4,
  Body,
  BodySmall,
  Caption,
  Muted,
  Label,
} from '../index'

const meta: Meta = {
  title: 'Primitives/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <H1>Heading 1 - The quick brown fox</H1>
      <H2>Heading 2 - The quick brown fox</H2>
      <H3>Heading 3 - The quick brown fox</H3>
      <H4>Heading 4 - The quick brown fox</H4>
    </div>
  ),
}

export const BodyText: Story = {
  render: () => (
    <div className="max-w-prose space-y-4">
      <Body>
        Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris.
      </Body>
      <BodySmall>
        Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </BodySmall>
    </div>
  ),
}

export const HelperText: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label>Label</Label>
        <div className="mt-1">
          <Caption>Caption - Small helper text for additional context</Caption>
        </div>
      </div>
      <div>
        <Label>Field Label</Label>
        <div className="mt-1">
          <Muted>Muted - Secondary information or descriptions</Muted>
        </div>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="space-y-2">
      <Body color="default">Default color</Body>
      <Body color="muted">Muted color</Body>
      <Body color="error">Error color</Body>
      <Body color="success">Success color</Body>
      <Body color="warning">Warning color</Body>
      <Body color="info">Info color</Body>
    </div>
  ),
}

export const Truncate: Story = {
  render: () => (
    <div className="w-[200px] space-y-4 border p-4">
      <Body truncate>
        This is a very long text that should be truncated with an ellipsis
      </Body>
      <BodySmall truncate>
        Another long text that will also be truncated at the end
      </BodySmall>
    </div>
  ),
}

export const SemanticTags: Story = {
  render: () => (
    <div className="space-y-4">
      <H1 as="h2">H1 styles on h2 tag</H1>
      <Body as="span">Body styled as span</Body>
      <BodySmall as="label">BodySmall styled as label</BodySmall>
    </div>
  ),
}

export const FullHierarchy: Story = {
  render: () => (
    <div className="max-w-prose space-y-6">
      <div>
        <H1>Page Title</H1>
        <Muted>A brief description of the page content</Muted>
      </div>

      <div className="space-y-4">
        <H2>Section Heading</H2>
        <Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Body>

        <H3>Subsection</H3>
        <BodySmall>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </BodySmall>

        <H4>Minor Heading</H4>
        <Caption>Additional notes and fine print</Caption>
      </div>

      <div className="space-y-2">
        <Label>Form Label</Label>
        <div className="bg-muted/20 h-9 rounded-md border" />
        <Muted>Helper text for the input field</Muted>
      </div>
    </div>
  ),
}

export const WithCustomClassName: Story = {
  render: () => (
    <div className="space-y-4">
      <H1 className="text-primary">Custom colored H1</H1>
      <Body className="italic">Italic body text</Body>
      <BodySmall className="font-bold underline">
        Bold underlined small text
      </BodySmall>
    </div>
  ),
}
