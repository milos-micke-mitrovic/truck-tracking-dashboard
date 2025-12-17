import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTrailers } from '../api'
import { useAdminTab } from '../hooks'
import type { Trailer, TrailerFilters } from '../types'
import { STATUS_VALUES, OWNERSHIP_VALUES } from '../constants'
import { TrailerSheet } from './dialogs'
import { Button, Input, Select, Badge, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function TrailersTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    handlePaginationChange,
    dialogOpen,
    setDialogOpen,
    selectedItem,
    handleRowClick,
    handleAdd,
  } = useAdminTab<TrailerFilters, Trailer>({
    defaultFilters: { status: 'active' },
  })

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
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.trailerId')}
            value={filters.trailerId || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('trailerId', value)}
            className="w-[150px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...OWNERSHIP_VALUES.map((value) => ({
                value,
                label: t(`ownership.${value}`),
              })),
            ]}
            value={filters.ownership || 'all'}
            onChange={(value) =>
              updateFilter('ownership', value as TrailerFilters['ownership'])
            }
            placeholder={t('filters.ownership')}
            className="w-[130px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...STATUS_VALUES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ]}
            value={filters.status || 'active'}
            onChange={(value) =>
              updateFilter('status', value as TrailerFilters['status'])
            }
            placeholder={t('filters.status')}
            className="w-[130px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            <span className="hidden sm:inline">{t('actions.addTrailer')}</span>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        manualPagination
        pageCount={data?.meta.totalPages}
        totalCount={data?.meta.total}
        pageIndex={pagination.page - 1}
        pageSize={pagination.pageSize}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
      />
      <TrailerSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trailer={selectedItem}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
