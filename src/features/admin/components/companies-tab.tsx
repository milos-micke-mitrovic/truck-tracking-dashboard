import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useCompanies } from '../api'
import type { Company, CompanyFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { Button, Input } from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function CompaniesTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<CompanyFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

  const { data, isLoading, refetch } = useCompanies({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.name')} />
      ),
    },
    {
      accessorKey: 'dotNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.dotNumber')} />
      ),
    },
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.address')} />
      ),
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.phone')} />
      ),
    },
    {
      accessorKey: 'emailDomain',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.emailDomain')}
        />
      ),
    },
    {
      accessorKey: 'fleet',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.fleet')} />
      ),
      cell: ({ row }) => t(`fleet.${row.original.fleet}`),
    },
    {
      accessorKey: 'plan',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.plan')} />
      ),
      cell: ({ row }) => t(`plan.${row.original.plan}`),
    },
    {
      accessorKey: 'terminalCount',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.terminalCount')}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.status')} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]

  return (
    <div>
      <AdminToolbar
        filters={
          <>
            <Input
              placeholder={t('filters.name')}
              value={filters.name || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full sm:max-w-[200px]"
            />
            <Input
              placeholder={t('filters.dotNumber')}
              value={filters.dotNumber || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dotNumber: e.target.value }))
              }
              className="w-full sm:max-w-[150px]"
            />
            <FormSelect
              options={[
                { value: 'all', label: t('filters.all') },
                { value: 'active', label: t('status.active') },
                { value: 'inactive', label: t('status.inactive') },
              ]}
              value={filters.status || 'active'}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  status: value as CompanyFilters['status'],
                }))
              }
              label={t('filters.status')}
            />
          </>
        }
        addButton={
          <Button size="sm">
            <Plus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.addCompany')}</span>
          </Button>
        }
        onExport={() => {}}
        onRefresh={() => refetch()}
      />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        manualPagination
        pageCount={data?.meta.totalPages}
        pageIndex={pagination.page - 1}
        pageSize={pagination.pageSize}
        onPaginationChange={(state: PaginationState) =>
          setPagination({ page: state.pageIndex + 1, pageSize: state.pageSize })
        }
      />
    </div>
  )
}
