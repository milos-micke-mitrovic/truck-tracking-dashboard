import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'
import { useCameraDevices } from '../../api'
import { useAdminTab } from '../../hooks'
import type { CameraDevice, CameraDeviceFilters } from '../../types'
import { AdminToolbar } from '../admin-toolbar'
import { StatusBadge } from '../status-badge'
import { OrderDeviceDialog } from '../dialogs'
import { Button, Select, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'
import { vehicles } from '@/mocks/data'

export function CameraDevicesTab() {
  const { t } = useTranslation('admin')
  const {
    filters,
    updateFilter,
    pagination,
    handlePaginationChange,
  } = useAdminTab<CameraDeviceFilters, CameraDevice>({
    defaultFilters: {},
  })

  const { data, isLoading, refetch } = useCameraDevices({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<CameraDevice>[] = [
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
        <DataTableColumnHeader column={column} title={t('columns.snNumber')} />
      ),
      cell: ({ row }) => (
        <Caption as="span" className="font-mono">
          {row.original.serialNumber}
        </Caption>
      ),
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

  const vehicleOptions = [
    { value: 'all', label: t('filters.all') },
    ...vehicles.map((v) => ({ value: v.id, label: `${v.unitNumber}` })),
  ]

  return (
    <div>
      <AdminToolbar
        filters={
          <Select
            options={vehicleOptions}
            value={filters.vehicleId || 'all'}
            onChange={(value) => updateFilter('vehicleId', value as CameraDeviceFilters['vehicleId'])}
            placeholder={t('filters.vehicle')}
            className="w-[150px]"
          />
        }
        addButton={
          <OrderDeviceDialog
            deviceType="camera"
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
