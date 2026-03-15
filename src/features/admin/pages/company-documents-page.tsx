import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth'
import { Button, H1, Select, Spinner, DataTable, DataTableColumnHeader, Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui'
import { downloadDocument } from '@/shared/api/documents'
import { formatDate } from '@/shared/utils'
import { useCompanies, useMyCompany, useCompanyDocuments } from '../api'
import type { CompanyDocumentItem } from '../types'
import { usePageTitle } from '@/shared/hooks'

function formatDocumentType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function CompanyDocumentsPage() {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const { data: companiesData } = useCompanies(
    isAdmin ? { size: 100, tenantId: user?.tenantId } : { enabled: false }
  )
  const { data: myCompany } = useMyCompany(!isAdmin)
  const { data: documents, isLoading } = useCompanyDocuments(
    isAdmin ? selectedCompanyId : undefined
  )

  const pageTitle = !isAdmin && myCompany?.fullName
    ? t('companyDocuments.titleWithCompany', { company: myCompany.fullName })
    : t('companyDocuments.title')

  usePageTitle(pageTitle)

  const companyOptions = useMemo(
    () => [
      { value: '', label: t('companyDocuments.allCompanies') },
      ...(companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.fullName,
      })),
    ],
    [companiesData, t]
  )

  const handleDownload = async (doc: CompanyDocumentItem) => {
    setDownloadingId(doc.id)
    try {
      await downloadDocument('company', doc.id)
    } catch {
      toast.error(t('companyDocuments.downloadError', { fileName: doc.name }))
    } finally {
      setDownloadingId(null)
    }
  }

  const columns: ColumnDef<CompanyDocumentItem>[] = useMemo(
    () => [
      {
        accessorKey: 'companyName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('companyDocuments.columns.company')} />
        ),
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('companyDocuments.columns.documentType')} />
        ),
        cell: ({ row }) => formatDocumentType(row.original.type),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('companyDocuments.columns.fileName')} />
        ),
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-[200px] truncate">
                {row.original.name}
              </span>
            </TooltipTrigger>
            <TooltipContent>{row.original.name}</TooltipContent>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'expirationDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('companyDocuments.columns.expiryDate')} />
        ),
        cell: ({ row }) => {
          const dateStr = row.original.expirationDate
          return (
            <span className={isExpired(dateStr) ? 'text-destructive font-medium' : ''}>
              {dateStr ? formatDate(dateStr) : '—'}
            </span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('companyDocuments.columns.uploadDate')} />
        ),
        cell: ({ row }) => (row.original.createdAt ? formatDate(row.original.createdAt) : '—'),
      },
      {
        id: 'actions',
        header: t('companyDocuments.columns.download'),
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
    [downloadingId, t]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <H1>{pageTitle}</H1>

      {isAdmin && (
        <div className="flex items-center gap-3">
          <Select
            options={companyOptions}
            value={selectedCompanyId !== undefined ? String(selectedCompanyId) : ''}
            onChange={(value) =>
              setSelectedCompanyId(value ? parseInt(value, 10) : undefined)
            }
            placeholder={t('companyDocuments.allCompanies')}
            className="w-[240px]"
          />
        </div>
      )}

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
