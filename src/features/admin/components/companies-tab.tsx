import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useCompanies } from '../api'
import { useAdminTab } from '../hooks'
import type { Company, CompanyFilters } from '../types'
import { STATUS_VALUES } from '../constants'
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
  } = useAdminTab<CompanyFilters, Company>({
    defaultFilters: { status: 'active' },
  })

  const { data, isLoading, refetch } = useCompanies({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
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
      accessorKey: 'phone',
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
      accessorKey: 'plan',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.plan')} />
      ),
      cell: ({ row }) => t(`plan.${row.original.plan}`),
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
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.name')}
            value={filters.name || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('name', value)}
            className="w-[200px]"
          />
          <Input
            placeholder={t('filters.dotNumber')}
            value={filters.dotNumber || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('dotNumber', value)}
            className="w-[150px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...STATUS_VALUES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ]}
            value={filters.status || 'active'}
            onChange={(value) =>
              updateFilter('status', value as CompanyFilters['status'])
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

      <CompanySheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={selectedCompany}
        onSuccess={refetch}
      />
    </div>
  )
}
