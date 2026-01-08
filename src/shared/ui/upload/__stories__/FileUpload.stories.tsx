import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { FileUpload } from '../file-upload'

// Helper to get file name(s) from onFileSelect callback
const getFileName = (files: File | File[]): string =>
  Array.isArray(files) ? files[0]?.name || '' : files.name

const getFileNames = (files: File | File[]): string[] =>
  Array.isArray(files) ? files.map((f) => f.name) : [files.name]

const meta: Meta<typeof FileUpload> = {
  title: 'Upload/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>()
    return (
      <FileUpload
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
      />
    )
  },
}

export const WithFileName: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>('document.pdf')
    return (
      <FileUpload
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
      />
    )
  },
}

export const CompactVariant: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>()
    return (
      <FileUpload
        variant="compact"
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
        buttonLabel="Upload PDF"
      />
    )
  },
}

export const CompactWithFile: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>('invoice_2024.pdf')
    return (
      <FileUpload
        variant="compact"
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
        buttonLabel="Upload PDF"
      />
    )
  },
}

export const Loading: Story = {
  render: () => (
    <FileUpload
      onFileSelect={() => {}}
      loading
    />
  ),
}

export const AcceptPdfOnly: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>()
    return (
      <FileUpload
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
        accept=".pdf"
        hint="PDF files only"
      />
    )
  },
}

export const AcceptImages: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>()
    return (
      <FileUpload
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
        accept="image/*"
        hint="Images only (PNG, JPG, etc.)"
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [fileName, setFileName] = useState<string | undefined>()
    return (
      <FileUpload
        onFileSelect={(files) => setFileName(getFileName(files))}
        onRemove={() => setFileName(undefined)}
        fileName={fileName}
        error="File is required"
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <FileUpload
      onFileSelect={() => {}}
      disabled
    />
  ),
}

export const MultipleFiles: Story = {
  render: () => {
    const [fileNames, setFileNames] = useState<string[]>([])
    return (
      <FileUpload
        multiple
        onFileSelect={(files) =>
          setFileNames((prev) => [...prev, ...getFileNames(files)])
        }
        onRemove={(index) =>
          setFileNames((prev) =>
            index !== undefined ? prev.filter((_, i) => i !== index) : []
          )
        }
        fileName={fileNames}
        hint="Select multiple files"
      />
    )
  },
}

export const MultipleFilesCompact: Story = {
  render: () => {
    const [fileNames, setFileNames] = useState<string[]>([])
    return (
      <FileUpload
        variant="compact"
        multiple
        onFileSelect={(files) =>
          setFileNames((prev) => [...prev, ...getFileNames(files)])
        }
        onRemove={(index) =>
          setFileNames((prev) =>
            index !== undefined ? prev.filter((_, i) => i !== index) : []
          )
        }
        fileName={fileNames}
        buttonLabel="Add Files"
      />
    )
  },
}
