import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useCompanies } from '../api'
import { useAdminTab } from '../hooks'
import type { CompanyListItem, CompanyFilters, CompanyStatus } from '../types'
import { COMPANY_STATUS_VALUES } from '../constants'
import { StatusBadge } from './status-badge'
import { CompanySheet } from './dialogs'
import { Button, Input, Select } from '@/shared/ui'
import {
  DataTable,
  DataTableColumnHeader,
  FilterToggle,
  type FilterConfig,
} from '@/shared/ui'
import { useFilterVisibility } from '@/shared/hooks'

// Define all available filters for companies (matches BE CompanyFilterRequest)
const COMPANY_FILTERS: FilterConfig[] = [
  { key: 'fullName', labelKey: 'filters.name' },
  { key: 'dotNumber', labelKey: 'filters.dotNumber' },
  { key: 'mcNumber', labelKey: 'filters.mcNumber' },
  { key: 'address', labelKey: 'filters.address' },
  { key: 'phoneNumber', labelKey: 'filters.phone' },
  { key: 'emailDomain', labelKey: 'filters.emailDomain' },
  { key: 'status', labelKey: 'filters.status' },
]

// Default visible filters (currently shown in UI)
const DEFAULT_VISIBLE = ['fullName', 'dotNumber', 'status']

export function CompaniesTab() {
  const { t } = useTranslation('admin')
  const { visibleFilters, toggleFilter, isFilterVisible } = useFilterVisibility({
    storageKey: 'admin-companies',
    defaultVisible: DEFAULT_VISIBLE,
  })

  const {
    filters,
    updateFilter,
    pagination,
    dialogOpen,
    setDialogOpen,
    selectedItem: selectedCompany,
    handleAdd,
    handleRowClick,
    handlePaginationChange,
  } = useAdminTab<CompanyFilters, CompanyListItem>({
    defaultFilters: {},
  })

  const { data, isLoading, isFetching } = useCompanies({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<CompanyListItem>[] = useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.name')} />
        ),
      },
      {
        accessorKey: 'dotNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.dotNumber')} />
        ),
      },
      {
        accessorKey: 'mcNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.mcNumber')} />
        ),
      },
      {
        accessorKey: 'address',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.address')} />
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.phone')} />
        ),
      },
      {
        accessorKey: 'emailDomain',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('columns.emailDomain')}
          />
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
          {isFilterVisible('fullName') && (
            <Input
              placeholder={t('filters.name')}
              value={filters.fullName || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('fullName', value)}
              clearable
              className="w-[200px]"
            />
          )}
          {isFilterVisible('dotNumber') && (
            <Input
              placeholder={t('filters.dotNumber')}
              value={filters.dotNumber || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('dotNumber', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('mcNumber') && (
            <Input
              placeholder={t('filters.mcNumber')}
              value={filters.mcNumber || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('mcNumber', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('address') && (
            <Input
              placeholder={t('filters.address')}
              value={filters.address || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('address', value)}
              clearable
              className="w-[180px]"
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
          {isFilterVisible('emailDomain') && (
            <Input
              placeholder={t('filters.emailDomain')}
              value={filters.emailDomain || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('emailDomain', value)}
              clearable
              className="w-[180px]"
            />
          )}
          {isFilterVisible('status') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...COMPANY_STATUS_VALUES.map((value) => ({
                  value,
                  label: t(`status.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.status || ''}
              onChange={(value) =>
                updateFilter('status', value as CompanyStatus | 'all')
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          )}
          <FilterToggle
            filters={COMPANY_FILTERS}
            visibleFilters={visibleFilters}
            onToggleFilter={toggleFilter}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            <span className="hidden sm:inline">{t('actions.addCompany')}</span>
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

      <CompanySheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        companyId={selectedCompany?.id}
      />
    </div>
  )
}
