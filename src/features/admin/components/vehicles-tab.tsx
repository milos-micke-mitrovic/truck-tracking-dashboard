import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useVehicles } from '../api'
import type { Vehicle, VehicleFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { AddVehicleDialog } from './dialogs'
import { Button, Input, Select, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function VehiclesTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<VehicleFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

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
      <AdminToolbar
        filters={
          <>
            <Input
              placeholder={t('filters.unitNumber')}
              value={filters.unitNumber || ''}
              debounce={300}
              onDebounceChange={(value) =>
                setFilters((f) => ({ ...f, unitNumber: value }))
              }
              className="w-[150px]"
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
                  status: value as VehicleFilters['status'],
                }))
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          </>
        }
        addButton={
          <AddVehicleDialog
            trigger={
              <Button size="sm" prefixIcon={<Plus className="size-4" />}>
                <span className="hidden sm:inline">{t('actions.addVehicle')}</span>
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
