import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTrailers } from '../api'
import type { Trailer, TrailerFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { AddTrailerDialog } from './dialogs'
import { Button, Input, Select, Badge, BodySmall, Caption } from '@/shared/ui'
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
        <BodySmall as="span" truncate className="max-w-[180px]">
          {row.original.companyName}
        </BodySmall>
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
        <BodySmall as="span" truncate className="max-w-[200px]">
          {row.original.type}
        </BodySmall>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.model')} />
      ),
      cell: ({ row }) => (
        <BodySmall as="span" truncate className="max-w-[200px]">
          {row.original.model}
        </BodySmall>
      ),
    },
    {
      accessorKey: 'vin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.vin')} />
      ),
      cell: ({ row }) => (
        <Caption as="span" truncate className="max-w-[160px] font-mono">
          {row.original.vin}
        </Caption>
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
              debounce={300}
              onDebounceChange={(value) =>
                setFilters((f) => ({ ...f, trailerId: value }))
              }
              className="w-[150px]"
            />
            <Select
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
              placeholder={t('filters.ownership')}
              className="w-[130px]"
            />
            <Select
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
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          </>
        }
        addButton={
          <AddTrailerDialog
            trigger={
              <Button size="sm" prefixIcon={<Plus className="size-4" />}>
                <span className="hidden sm:inline">{t('actions.addTrailer')}</span>
              </Button>
            }
            onSuccess={() => refetch()}
          />
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
        totalCount={data?.meta.total}
        pageIndex={pagination.page - 1}
        pageSize={pagination.pageSize}
        onPaginationChange={(state: PaginationState) =>
          setPagination({ page: state.pageIndex + 1, pageSize: state.pageSize })
        }
      />
    </div>
  )
}
