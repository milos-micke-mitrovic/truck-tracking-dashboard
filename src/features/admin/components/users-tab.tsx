import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useUsers } from '../api'
import type { User, UserFilters } from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import { Button, Input, Badge } from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function UsersTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<UserFilters>({
    status: 'active',
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

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
        <span className="max-w-[180px] truncate">{row.original.email}</span>
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
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full sm:max-w-[200px]"
            />
            <FormSelect
              options={[
                { value: 'all', label: t('filters.all') },
                { value: 'dispatch', label: t('departments.dispatch') },
                { value: 'accounting', label: t('departments.accounting') },
                {
                  value: 'fleet_management',
                  label: t('departments.fleet_management'),
                },
                { value: 'operations', label: t('departments.operations') },
                { value: 'safety', label: t('departments.safety') },
              ]}
              value={filters.department || 'all'}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  department: value as UserFilters['department'],
                }))
              }
              label={t('filters.department')}
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
                  status: value as UserFilters['status'],
                }))
              }
              label={t('filters.status')}
            />
          </>
        }
        addButton={
          <Button size="sm">
            <Plus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.addUser')}</span>
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
