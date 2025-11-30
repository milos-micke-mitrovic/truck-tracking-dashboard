import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useVehicles } from '../api'
import type { Vehicle, VehicleFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { Button, Input } from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
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
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
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
        <span className="max-w-[140px] truncate font-mono text-xs">
          {row.original.vin}
        </span>
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
              onChange={(e) =>
                setFilters((f) => ({ ...f, unitNumber: e.target.value }))
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
                  status: value as VehicleFilters['status'],
                }))
              }
              label={t('filters.status')}
            />
          </>
        }
        addButton={
          <Button size="sm">
            <Plus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.addVehicle')}</span>
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
