import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'
import { usePortableDevices } from '../../api'
import { useAdminTab } from '../../hooks'
import type { PortableDevice, PortableDeviceFilters } from '../../types'
import { AdminToolbar } from '../admin-toolbar'
import { StatusBadge } from '../status-badge'
import { OrderDeviceDialog } from '../dialogs'
import { Button, Select, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'
import { drivers } from '@/mocks/data'

export function PortableDevicesTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    handlePaginationChange,
  } = useAdminTab<PortableDeviceFilters, PortableDevice>({
    defaultFilters: {},
  })

  const { data, isLoading, refetch } = usePortableDevices({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<PortableDevice>[] = [
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
      accessorKey: 'platform',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.platform')} />
      ),
    },
    {
      accessorKey: 'platformVersion',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.platformVersion')}
        />
      ),
    },
    {
      accessorKey: 'identifier',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.identifier')}
        />
      ),
      cell: ({ row }) => (
        <Caption as="span" truncate className="max-w-[160px] font-mono">
          {row.original.identifier}
        </Caption>
      ),
    },
    {
      accessorKey: 'appVersion',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.appVersion')}
        />
      ),
    },
    {
      accessorKey: 'driverName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.driver')} />
      ),
      cell: ({ row }) => row.original.driverName || '-',
    },
    {
      accessorKey: 'sequenceId',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.sequenceId')}
        />
      ),
    },
    {
      accessorKey: 'online',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.online')} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.online} />,
    },
  ]

  const driverOptions = [
    { value: 'all', label: t('filters.all') },
    ...drivers.map((d) => ({ value: d.id, label: d.name })),
  ]

  return (
    <div>
      <AdminToolbar
        filters={
          <Select
            options={driverOptions}
            value={filters.driverId || 'all'}
            onChange={(value) => updateFilter('driverId', value as PortableDeviceFilters['driverId'])}
            placeholder={t('filters.driver')}
            className="w-[150px]"
          />
        }
        addButton={
          <OrderDeviceDialog
            deviceType="portable"
            trigger={
              <Button size="sm" variant="default" prefixIcon={<ShoppingCart />}>
                <span className="hidden sm:inline">{t('actions.order')}</span>
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
