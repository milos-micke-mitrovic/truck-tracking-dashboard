import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTrailers } from '../api'
import { useAdminTab } from '../hooks'
import type {
  TrailerListItem,
  TrailerFilters,
  TrailerStatus,
  TrailerOwnership,
  TrailerType,
} from '../types'
import {
  TRAILER_STATUS_VALUES,
  TRAILER_OWNERSHIP_VALUES,
  TRAILER_TYPE_VALUES,
} from '../constants'
import { StatusBadge } from './status-badge'
import { TrailerSheet } from './dialogs'
import { Button, Input, Select, Badge, BodySmall, Caption } from '@/shared/ui'
import {
  DataTable,
  DataTableColumnHeader,
  FilterToggle,
  type FilterConfig,
} from '@/shared/ui'
import { useFilterVisibility } from '@/shared/hooks'

// Define all available filters for trailers
const TRAILER_FILTERS: FilterConfig[] = [
  { key: 'unitId', labelKey: 'filters.unitId' },
  { key: 'type', labelKey: 'filters.type' },
  { key: 'model', labelKey: 'filters.model' },
  { key: 'vin', labelKey: 'filters.vin' },
  { key: 'licensePlate', labelKey: 'filters.licensePlate' },
  { key: 'ownership', labelKey: 'filters.ownership' },
  { key: 'status', labelKey: 'filters.status' },
]

// Default visible filters (currently shown in UI)
const DEFAULT_VISIBLE = ['unitId', 'ownership', 'status']

export function TrailersTab() {
  const { t } = useTranslation('admin')
  const { visibleFilters, toggleFilter, isFilterVisible } = useFilterVisibility({
    storageKey: 'admin-trailers',
    defaultVisible: DEFAULT_VISIBLE,
  })

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
  } = useAdminTab<TrailerFilters, TrailerListItem>({
    defaultFilters: {},
  })

  const { data, isLoading, isFetching } = useTrailers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<TrailerListItem>[] = useMemo(
    () => [
      {
        accessorKey: 'unitId',
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
          <BodySmall as="span" truncate className="max-w-[150px]">
            {row.original.type.replace(/_/g, ' ')}
          </BodySmall>
        ),
      },
      {
        accessorKey: 'model',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.model')} />
        ),
        cell: ({ row }) => (
          <BodySmall as="span" truncate className="max-w-[180px]">
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
            {t(`trailerOwnership.${row.original.ownership.toLowerCase()}`)}
          </Badge>
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
    ],
    [t]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {isFilterVisible('unitId') && (
            <Input
              placeholder={t('filters.trailerId')}
              value={filters.unitId || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('unitId', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('type') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...TRAILER_TYPE_VALUES.map((value) => ({
                  value,
                  label: t(`trailerType.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.type || 'all'}
              onChange={(value) =>
                updateFilter('type', value as TrailerType | 'all')
              }
              placeholder={t('filters.type')}
              className="w-[150px]"
            />
          )}
          {isFilterVisible('model') && (
            <Input
              placeholder={t('filters.model')}
              value={filters.model || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('model', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('vin') && (
            <Input
              placeholder={t('filters.vin')}
              value={filters.vin || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('vin', value)}
              clearable
              className="w-[180px]"
            />
          )}
          {isFilterVisible('licensePlate') && (
            <Input
              placeholder={t('filters.licensePlate')}
              value={filters.licensePlate || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('licensePlate', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('ownership') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...TRAILER_OWNERSHIP_VALUES.map((value) => ({
                  value,
                  label: t(`trailerOwnership.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.ownership || 'all'}
              onChange={(value) =>
                updateFilter('ownership', value as TrailerOwnership | 'all')
              }
              placeholder={t('filters.ownership')}
              className="w-[150px]"
            />
          )}
          {isFilterVisible('status') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...TRAILER_STATUS_VALUES.map((value) => ({
                  value,
                  label: t(`status.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.status || ''}
              onChange={(value) =>
                updateFilter('status', value as TrailerStatus | 'all')
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          )}
          <FilterToggle
            filters={TRAILER_FILTERS}
            visibleFilters={visibleFilters}
            onToggleFilter={toggleFilter}
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
      <TrailerSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trailerId={selectedItem?.id}
      />
    </div>
  )
}
