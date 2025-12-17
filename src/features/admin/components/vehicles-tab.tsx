import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useVehicles } from '../api'
import { useAdminTab } from '../hooks'
import type { Vehicle, VehicleFilters } from '../types'
import { STATUS_VALUES } from '../constants'
import { StatusBadge } from './status-badge'
import { VehicleSheet } from './dialogs'
import { Button, Input, Select, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function VehiclesTab() {
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
  } = useAdminTab<VehicleFilters, Vehicle>({
    defaultFilters: { status: 'active' },
  })

  const { data, isLoading, refetch } = useVehicles({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<Vehicle>[] = [
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
      accessorKey: 'unitNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.unitNumber')}
        />
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
      accessorKey: 'vin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.vin')} />
      ),
      cell: ({ row }) => (
        <Caption as="span" truncate className="max-w-[140px] font-mono">
          {row.original.vin}
        </Caption>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.model')} />
      ),
    },
    {
      accessorKey: 'make',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.make')} />
      ),
    },
    {
      accessorKey: 'year',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.year')} />
      ),
    },
    {
      accessorKey: 'driverName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.driver')} />
      ),
      cell: ({ row }) => row.original.driverName || '-',
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.tags')} />
      ),
      cell: ({ row }) =>
        row.original.tags.length > 0 ? row.original.tags.join(', ') : '-',
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
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.unitNumber')}
            value={filters.unitNumber || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('unitNumber', value)}
            className="w-[150px]"
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
              updateFilter('status', value as VehicleFilters['status'])
            }
            placeholder={t('filters.status')}
            className="w-[130px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            <span className="hidden sm:inline">{t('actions.addVehicle')}</span>
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
      <VehicleSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={selectedItem}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
