import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useDrivers } from '../api'
import { useAdminTab } from '../hooks'
import type { DriverListItem, DriverFilters, DriverStatus } from '../types'
import { DRIVER_STATUS_VALUES } from '../constants'
import { StatusBadge } from './status-badge'
import { DriverSheet } from './dialogs'
import { Button, Input, Select, BodySmall } from '@/shared/ui'
import {
  DataTable,
  DataTableColumnHeader,
  FilterToggle,
  type FilterConfig,
} from '@/shared/ui'
import { useFilterVisibility } from '@/shared/hooks'

// Define all available filters for drivers (matches BE DriverFilterRequest)
const DRIVER_FILTERS: FilterConfig[] = [
  { key: 'name', labelKey: 'filters.name' },
  { key: 'username', labelKey: 'filters.username' },
  { key: 'phoneNumber', labelKey: 'filters.phone' },
  { key: 'companyId', labelKey: 'filters.company' },
  { key: 'status', labelKey: 'filters.status' },
]

// Default visible filters (currently shown in UI)
const DEFAULT_VISIBLE = ['name', 'phoneNumber', 'status']

export function DriversTab() {
  const { t } = useTranslation('admin')
  const { visibleFilters, toggleFilter, isFilterVisible } = useFilterVisibility({
    storageKey: 'admin-drivers',
    defaultVisible: DEFAULT_VISIBLE,
  })

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
  } = useAdminTab<DriverFilters, DriverListItem>({
    defaultFilters: {},
  })

  const { data, isLoading, isFetching } = useDrivers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<DriverListItem>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.name')} />
        ),
        cell: ({ row }) => (
          <BodySmall as="span" truncate className="max-w-[180px]">
            {row.original.name}
          </BodySmall>
        ),
      },
      {
        accessorKey: 'username',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.username')} />
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.phone')} />
        ),
        cell: ({ row }) => row.original.phoneNumber || '-',
      },
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
                | 'suspended'
            }
          />
        ),
      },
    ],
    [t]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {isFilterVisible('name') && (
            <Input
              placeholder={t('filters.name')}
              value={filters.name || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('name', value)}
              clearable
              className="w-[200px]"
            />
          )}
          {isFilterVisible('username') && (
            <Input
              placeholder={t('filters.username')}
              value={filters.username || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('username', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('phoneNumber') && (
            <Input
              placeholder={t('filters.phone')}
              value={filters.phoneNumber || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('phoneNumber', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('companyId') && (
            <Input
              placeholder={t('filters.company')}
              value={filters.companyId ? String(filters.companyId) : ''}
              debounce={300}
              onDebounceChange={(value) =>
                updateFilter('companyId', value ? Number(value) : undefined)
              }
              clearable
              className="w-[180px]"
            />
          )}
          {isFilterVisible('status') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...DRIVER_STATUS_VALUES.map((value) => ({
                  value,
                  label: t(`status.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.status || ''}
              onChange={(value) =>
                updateFilter('status', value as DriverStatus | 'all')
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          )}
          <FilterToggle
            filters={DRIVER_FILTERS}
            visibleFilters={visibleFilters}
            onToggleFilter={toggleFilter}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            <span className="hidden sm:inline">{t('actions.addDriver')}</span>
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

      <DriverSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        driverId={selectedDriver?.id}
      />
    </div>
  )
}
