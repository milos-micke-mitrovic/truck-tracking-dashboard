import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useDrivers } from '../api'
import { useAdminTab } from '../hooks'
import type { Driver, DriverFilters } from '../types'
import { STATUS_VALUES } from '../constants'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { DriverDialog } from './dialogs'
import { Button, Input, Select, BodySmall } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function DriversTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    dialogOpen,
    setDialogOpen,
    selectedItem: selectedDriver,
    handleAdd,
    handleRowClick,
    handlePaginationChange,
  } = useAdminTab<DriverFilters, Driver>({
    defaultFilters: { status: 'active' },
  })

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

  return (
    <div>
      <AdminToolbar
        filters={
          <>
            <Input
              placeholder={t('filters.name')}
              value={filters.name || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('name', value)}
              className="w-[200px]"
            />
            <Input
              placeholder={t('filters.phone')}
              value={filters.phone || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('phone', value)}
              className="w-[150px]"
            />
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...STATUS_VALUES.map((value) => ({ value, label: t(`status.${value}`) })),
              ]}
              value={filters.status || 'active'}
              onChange={(value) => updateFilter('status', value as DriverFilters['status'])}
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          </>
        }
        addButton={
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
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
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
      />

      <DriverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        driver={selectedDriver}
        onSuccess={refetch}
      />
    </div>
  )
}
