import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useDrivers } from '../api'
import type { Driver, DriverFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { DriverDialog } from './dialogs'
import { Button, Input, Select, BodySmall } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function DriversTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<DriverFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

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
        <BodySmall as="span" truncate className="max-w-[180px]">
          {row.original.companyName}
        </BodySmall>
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

  const handleAddDriver = () => {
    setSelectedDriver(null)
    setDialogOpen(true)
  }

  const handleRowClick = (driver: Driver) => {
    setSelectedDriver(driver)
    setDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    refetch()
  }

  return (
    <div>
      <AdminToolbar
        filters={
          <>
            <Input
              placeholder={t('filters.name')}
              value={filters.name || ''}
              debounce={300}
              onDebounceChange={(value) => setFilters((f) => ({ ...f, name: value }))}
              className="w-[200px]"
            />
            <Input
              placeholder={t('filters.phone')}
              value={filters.phone || ''}
              debounce={300}
              onDebounceChange={(value) => setFilters((f) => ({ ...f, phone: value }))}
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
                  status: value as DriverFilters['status'],
                }))
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          </>
        }
        addButton={
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAddDriver}>
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
        totalCount={data?.meta.total}
        pageIndex={pagination.page - 1}
        pageSize={pagination.pageSize}
        onPaginationChange={(state: PaginationState) =>
          setPagination({ page: state.pageIndex + 1, pageSize: state.pageSize })
        }
        onRowClick={handleRowClick}
      />

      <DriverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        driver={selectedDriver}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
