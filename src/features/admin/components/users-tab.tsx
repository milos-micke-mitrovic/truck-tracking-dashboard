import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useUsers } from '../api'
import { useAdminTab } from '../hooks'
import type { UserListItem, UserFilters } from '../types'
import { USER_STATUS_VALUES, ROLE_VALUES } from '../constants'
import { StatusBadge } from './status-badge'
import { UserSheet } from './dialogs'
import { Button, Input, Select, Badge, BodySmall } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function UsersTab() {
  const { t } = useTranslation('admin')
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
  } = useAdminTab<UserFilters, UserListItem>({
    defaultFilters: { status: 'ACTIVE' },
  })

  const { data, isLoading, isFetching } = useUsers({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<UserListItem>[] = [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.name')} />
      ),
      cell: ({ row }) => {
        const firstName = row.original.firstName || ''
        const lastName = row.original.lastName || ''
        return `${firstName} ${lastName}`.trim() || '-'
      },
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.username')} />
      ),
      cell: ({ row }) => row.original.username || '-',
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
      cell: ({ row }) => row.original.department || '-',
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.role')} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`roles.${row.original.role.toLowerCase()}`)}
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
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('filters.name')}
            value={filters.firstName || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('firstName', value)}
            clearable
            className="w-[200px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...ROLE_VALUES.map((value) => ({
                value,
                label: t(`roles.${value.toLowerCase()}`),
              })),
            ]}
            value={filters.role || 'all'}
            onChange={(value) =>
              updateFilter('role', value as UserFilters['role'])
            }
            placeholder={t('columns.role')}
            className="w-[160px]"
          />
          <Select
            options={[
              { value: 'all', label: t('filters.all') },
              ...USER_STATUS_VALUES.map((value) => ({
                value,
                label: t(`status.${value.toLowerCase()}`),
              })),
            ]}
            value={filters.status || 'ACTIVE'}
            onChange={(value) =>
              updateFilter('status', value as UserFilters['status'])
            }
            placeholder={t('filters.status')}
            className="w-[130px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            <span className="hidden sm:inline">{t('actions.addUser')}</span>
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
      <UserSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={selectedItem?.id}
      />
    </div>
  )
}
