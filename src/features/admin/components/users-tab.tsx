import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useUsers } from '../api'
import { useAdminTab } from '../hooks'
import type { User, UserFilters } from '../types'
import { STATUS_VALUES, DEPARTMENT_VALUES } from '../constants'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { AddUserDialog } from './dialogs'
import { Button, Input, Select, Badge, BodySmall } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function UsersTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    handlePaginationChange,
  } = useAdminTab<UserFilters, User>({
    defaultFilters: { status: 'active' },
  })

  const { data, isLoading, refetch } = useUsers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'companyNames',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.companies')} />
      ),
      cell: ({ row }) => {
        const companies = row.original.companyNames
        if (companies.length === 1) return companies[0]
        return `${companies.length} companies`
      },
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
      accessorKey: 'extension',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.extension')} />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.email')} />
      ),
      cell: ({ row }) => (
        <BodySmall as="span" truncate className="max-w-[180px]">
          {row.original.email}
        </BodySmall>
      ),
    },
    {
      accessorKey: 'department',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.department')}
        />
      ),
      cell: ({ row }) => t(`departments.${row.original.department}`),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.role')} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{t(`roles.${row.original.role}`)}</Badge>
      ),
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
              placeholder={t('filters.name')}
              value={filters.name || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('name', value)}
              className="w-[200px]"
            />
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...DEPARTMENT_VALUES.map((value) => ({ value, label: t(`departments.${value}`) })),
              ]}
              value={filters.department || 'all'}
              onChange={(value) => updateFilter('department', value as UserFilters['department'])}
              placeholder={t('filters.department')}
              className="w-[160px]"
            />
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...STATUS_VALUES.map((value) => ({ value, label: t(`status.${value}`) })),
              ]}
              value={filters.status || 'active'}
              onChange={(value) => updateFilter('status', value as UserFilters['status'])}
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          </>
        }
        addButton={
          <AddUserDialog
            trigger={
              <Button size="sm" prefixIcon={<Plus />}>
                <span className="hidden sm:inline">{t('actions.addUser')}</span>
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
        onPaginationChange={handlePaginationChange}
      />
    </div>
  )
}
