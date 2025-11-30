import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useDrivers } from '../api'
import type { Driver, DriverFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { Button, Input } from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function DriversTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<DriverFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

  const { data, isLoading, refetch } = useDrivers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<Driver>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.name')} />
      ),
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.username')} />
      ),
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.phone')} />
      ),
    },
    {
      accessorKey: 'personalUse',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.personalUse')}
        />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.personalUse} />,
    },
    {
      accessorKey: 'yardMoves',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.yardMoves')} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.yardMoves} />,
    },
    {
      accessorKey: 'exempt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.exempt')} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.exempt} />,
    },
    {
      accessorKey: 'cycle',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.cycle')} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.cycle} />,
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
              placeholder={t('filters.phone')}
              value={filters.phone || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, phone: e.target.value }))
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
                  status: value as DriverFilters['status'],
                }))
              }
              label={t('filters.status')}
            />
          </>
        }
        addButton={
          <Button size="sm">
            <Plus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.addDriver')}</span>
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
