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
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function CompaniesTab() {
  const { t } = useTranslation('admin')
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
    defaultFilters: { status: 'ACTIVE' },
  })

  const { data, isLoading, isFetching } = useCompanies({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<CompanyListItem>[] = [
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
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.name')}
            value={filters.name || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('name', value)}
            clearable
            className="w-[200px]"
          />
          <Input
            placeholder={t('filters.dotNumber')}
            value={filters.dotNumber || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('dotNumber', value)}
            clearable
            className="w-[150px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...COMPANY_STATUS_VALUES.map((value) => ({
                value,
                label: t(`status.${value.toLowerCase()}`),
              })),
            ]}
            value={filters.status || 'ACTIVE'}
            onChange={(value) =>
              updateFilter('status', value as CompanyStatus | 'all')
            }
            placeholder={t('filters.status')}
            className="w-[130px]"
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
