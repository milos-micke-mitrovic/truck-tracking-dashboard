import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTrailers } from '../api'
import type { Trailer, TrailerFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { Button, Input, Badge } from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function TrailersTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<TrailerFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

  const { data, isLoading, refetch } = useTrailers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<Trailer>[] = [
    {
      accessorKey: 'companyName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.company')} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
      ),
    },
    {
      accessorKey: 'trailerId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.trailerId')} />
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.type')} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">{row.original.type}</span>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.model')} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">{row.original.model}</span>
      ),
    },
    {
      accessorKey: 'vin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.vin')} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[160px] truncate font-mono text-xs">
          {row.original.vin}
        </span>
      ),
    },
    {
      accessorKey: 'licensePlate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.licensePlate')}
        />
      ),
    },
    {
      accessorKey: 'ownership',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.ownership')} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`ownership.${row.original.ownership}`)}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <AdminToolbar
        filters={
          <>
            <Input
              placeholder={t('filters.trailerId')}
              value={filters.trailerId || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, trailerId: e.target.value }))
              }
              className="w-full sm:max-w-[150px]"
            />
            <FormSelect
              options={[
                { value: 'all', label: t('filters.all') },
                { value: 'company', label: t('ownership.company') },
                { value: 'contractor', label: t('ownership.contractor') },
              ]}
              value={filters.ownership || 'all'}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  ownership: value as TrailerFilters['ownership'],
                }))
              }
              label={t('filters.ownership')}
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
                  status: value as TrailerFilters['status'],
                }))
              }
              label={t('filters.status')}
            />
          </>
        }
        addButton={
          <Button size="sm">
            <Plus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.addTrailer')}</span>
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
