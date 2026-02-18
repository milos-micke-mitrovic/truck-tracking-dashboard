import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth'
import { Button, H1, Select, Spinner, DataTable, DataTableColumnHeader } from '@/shared/ui'
import { downloadDocument } from '@/shared/api/documents'
import { useCompanies, useCompanyDocuments } from '../api'
import type { CompanyDocumentItem } from '../types'

function formatDocumentType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString()
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function CompanyDocumentsPage() {
  const { user } = useAuth()
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const { data: companiesData } = useCompanies({ size: 100, tenantId: user?.tenantId })
  const { data: documents, isLoading } = useCompanyDocuments(selectedCompanyId)

  const companyOptions = useMemo(
    () => [
      { value: '', label: 'All Companies' },
      ...(companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.fullName,
      })),
    ],
    [companiesData]
  )

  const handleDownload = async (doc: CompanyDocumentItem) => {
    setDownloadingId(doc.id)
    try {
      await downloadDocument('company', doc.id)
    } catch {
      toast.error(`Failed to download "${doc.name}"`)
    } finally {
      setDownloadingId(null)
    }
  }

  const columns: ColumnDef<CompanyDocumentItem>[] = useMemo(
    () => [
      {
        accessorKey: 'companyName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Company" />
        ),
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Document Type" />
        ),
        cell: ({ row }) => formatDocumentType(row.original.type),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="File Name" />
        ),
      },
      {
        accessorKey: 'expirationDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry Date" />
        ),
        cell: ({ row }) => {
          const dateStr = row.original.expirationDate
          return (
            <span className={isExpired(dateStr) ? 'text-destructive font-medium' : ''}>
              {formatDate(dateStr)}
            </span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Upload Date" />
        ),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: 'Download',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(row.original)
            }}
            loading={downloadingId === row.original.id}
          >
            <Download className="size-4" />
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [downloadingId]
  )

  return (
    <div className="flex flex-col gap-6">
      <H1>Company Documents</H1>

      <div className="flex items-center gap-3">
        <Select
          options={companyOptions}
          value={selectedCompanyId !== undefined ? String(selectedCompanyId) : ''}
          onChange={(value) =>
            setSelectedCompanyId(value ? parseInt(value, 10) : undefined)
          }
          placeholder="All Companies"
          className="w-[240px]"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={documents || []}
          isLoading={false}
        />
      )}
    </div>
  )
}
