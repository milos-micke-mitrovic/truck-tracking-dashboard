import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useVehicles } from '../api'
import { useAdminTab } from '../hooks'
import type { VehicleListItem, VehicleFilters } from '../types'
import { VEHICLE_STATUS_VALUES } from '../constants'
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
  } = useAdminTab<VehicleFilters, VehicleListItem>({
    defaultFilters: { status: 'ACTIVE' },
  })

  const { data, isLoading, isFetching } = useVehicles({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<VehicleListItem>[] = [
    {
      accessorKey: 'unitId',
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
      accessorKey: 'make',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.make')} />
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.model')} />
      ),
    },
    {
      accessorKey: 'year',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.year')} />
      ),
    },
    {
      accessorKey: 'driver',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.driver')} />
      ),
      cell: ({ row }) => (
        <BodySmall as="span" truncate className="max-w-[150px]">
          {row.original.driver || '-'}
        </BodySmall>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.status')} />
      ),
      cell: ({ row }) => (
        <StatusBadge
          status={
            (row.original.status?.toLowerCase() || 'inactive') as
              | 'active'
              | 'inactive'
              | 'pending'
              | 'suspended'
          }
        />
      ),
    },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.unitNumber')}
            value={filters.unitId || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('unitId', value)}
            clearable
            className="w-[150px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...VEHICLE_STATUS_VALUES.map((value) => ({
                value,
                label: t(`status.${value.toLowerCase()}`),
              })),
            ]}
            value={filters.status || 'ACTIVE'}
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
        data={data?.content || []}
        isLoading={isLoading || isFetching}
        manualPagination
        pageCount={data?.totalPages}
        totalCount={data?.totalElements}
        pageIndex={pagination.page}
        pageSize={pagination.size}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
      />
      <VehicleSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicleId={selectedItem?.id}
      />
    </div>
  )
}
