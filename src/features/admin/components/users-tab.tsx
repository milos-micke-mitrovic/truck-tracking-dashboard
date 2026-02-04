import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useUsers } from '../api'
import { useAdminTab } from '../hooks'
import type { UserListItem, UserFilters, UserRole, UserStatus } from '../types'
import { USER_STATUS_VALUES, ROLE_VALUES } from '../constants'
import { StatusBadge } from './status-badge'
import { UserSheet } from './dialogs'
import { Button, Input, Select, Badge, BodySmall } from '@/shared/ui'
import {
  DataTable,
  DataTableColumnHeader,
  FilterToggle,
  type FilterConfig,
} from '@/shared/ui'
import { useFilterVisibility } from '@/shared/hooks'
import { useAuth, getVisibleRoles } from '@/features/auth'

// Define all available filters for users (matches BE UserFilterRequest)
const USER_FILTERS: FilterConfig[] = [
  { key: 'name', labelKey: 'filters.name' },
  { key: 'email', labelKey: 'filters.email' },
  { key: 'username', labelKey: 'filters.username' },
  { key: 'department', labelKey: 'filters.department' },
  { key: 'role', labelKey: 'filters.role' },
  { key: 'status', labelKey: 'filters.status' },
]

// Default visible filters (currently shown in UI)
const DEFAULT_VISIBLE = ['name', 'role', 'status']

export function UsersTab() {
  const { t } = useTranslation('admin')
  const { user: authUser } = useAuth()
  const visibleRoles = useMemo(() => getVisibleRoles(ROLE_VALUES, authUser), [authUser])
  const { visibleFilters, toggleFilter, isFilterVisible } = useFilterVisibility({
    storageKey: 'admin-users',
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
  } = useAdminTab<UserFilters, UserListItem>({
    defaultFilters: {},
  })

  const { data, isLoading, isFetching } = useUsers({
    ...filters,
    ...pagination,
  })

  // Filter out SUPER_ADMIN always, and ADMIN if current user is not SUPER_ADMIN
  const filteredContent = useMemo(
    () =>
      (data?.content || []).filter((u) =>
        visibleRoles.includes(u.role as (typeof visibleRoles)[number])
      ),
    [data?.content, visibleRoles]
  )

  const columns: ColumnDef<UserListItem>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.name')} />
      ),
      cell: ({ row }) => row.original.name || '-',
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
  ], [t])

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
          {isFilterVisible('email') && (
            <Input
              placeholder={t('filters.email')}
              value={filters.email || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('email', value)}
              clearable
              className="w-[180px]"
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
          {isFilterVisible('department') && (
            <Input
              placeholder={t('filters.department')}
              value={filters.department || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('department', value)}
              clearable
              className="w-[150px]"
            />
          )}
          {isFilterVisible('role') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...visibleRoles.map((value) => ({
                  value,
                  label: t(`roles.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.role || 'all'}
              onChange={(value) => updateFilter('role', value as UserRole | 'all')}
              placeholder={t('filters.role')}
              className="w-[160px]"
            />
          )}
          {isFilterVisible('status') && (
            <Select
              options={[
                { value: 'all', label: t('filters.all') },
                ...USER_STATUS_VALUES.map((value) => ({
                  value,
                  label: t(`status.${value.toLowerCase()}`),
                })),
              ]}
              value={filters.status || ''}
              onChange={(value) =>
                updateFilter('status', value as UserStatus | 'all')
              }
              placeholder={t('filters.status')}
              className="w-[130px]"
            />
          )}
          <FilterToggle
            filters={USER_FILTERS}
            visibleFilters={visibleFilters}
            onToggleFilter={toggleFilter}
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
        data={filteredContent}
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
