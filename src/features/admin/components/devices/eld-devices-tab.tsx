import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'
import { useEldDevices } from '../../api'
import { useAdminTab } from '../../hooks'
import type { EldDevice, EldDeviceFilters } from '../../types'
import { AdminToolbar } from '../admin-toolbar'
import { StatusBadge } from '../status-badge'
import { OrderDeviceDialog } from '../dialogs'
import { Button, Input, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function EldDevicesTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    handlePaginationChange,
  } = useAdminTab<EldDeviceFilters, EldDevice>({
    defaultFilters: {},
  })

  const { data, isLoading, refetch } = useEldDevices({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<EldDevice>[] = [
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
      accessorKey: 'manufacturer',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.manufacturer')}
        />
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.model')} />
      ),
      cell: ({ row }) => row.original.model || '-',
    },
    {
      accessorKey: 'serialNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.serialNumber')}
        />
      ),
      cell: ({ row }) => (
        <Caption as="span" className="font-mono">
          {row.original.serialNumber}
        </Caption>
      ),
    },
    {
      accessorKey: 'macAddress',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.macAddress')}
        />
      ),
      cell: ({ row }) => (
        <Caption as="span" className="font-mono">
          {row.original.macAddress || '-'}
        </Caption>
      ),
    },
    {
      accessorKey: 'firmwareVersion',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.firmwareVersion')}
        />
      ),
      cell: ({ row }) => row.original.firmwareVersion || '-',
    },
    {
      accessorKey: 'iccid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.iccid')} />
      ),
      cell: ({ row }) => row.original.iccid || '-',
    },
    {
      accessorKey: 'vehicleUnitNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.vehicle')} />
      ),
      cell: ({ row }) => row.original.vehicleUnitNumber || '-',
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
              placeholder={t('filters.serialNumber')}
              value={filters.serialNumber || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('serialNumber', value)}
              className="w-[180px]"
            />
            <Input
              placeholder={t('filters.macAddress')}
              value={filters.macAddress || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('macAddress', value)}
              className="w-[180px]"
            />
          </>
        }
        addButton={
          <OrderDeviceDialog
            deviceType="eld"
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
