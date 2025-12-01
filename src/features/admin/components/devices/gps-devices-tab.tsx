import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'
import { useGpsDevices } from '../../api'
import type { GpsDevice, GpsDeviceFilters } from '../../types'
import { AdminToolbar } from '../admin-toolbar'
import { StatusBadge } from '../status-badge'
import { OrderDeviceDialog } from '../dialogs'
import { Button, Input, BodySmall, Caption } from '@/shared/ui'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'

export function GpsDevicesTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<GpsDeviceFilters>({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

  const { data, isLoading, refetch } = useGpsDevices({
    ...filters,
    ...pagination,
  })

  const columns: ColumnDef<GpsDevice>[] = [
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
    },
    {
      accessorKey: 'assetLabel',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.asset')} />
      ),
      cell: ({ row }) => row.original.assetLabel || '-',
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
          <Input
            placeholder={t('filters.snNumber')}
            value={filters.serialNumber || ''}
            debounce={300}
            onDebounceChange={(value) =>
              setFilters((f) => ({ ...f, serialNumber: value }))
            }
            className="w-[200px]"
          />
        }
        addButton={
          <OrderDeviceDialog
            deviceType="gps"
            trigger={
              <Button size="sm" variant="default">
                <ShoppingCart className="size-4 sm:mr-2" />
                <BodySmall as="span" className="hidden sm:inline">
                  {t('actions.order')}
                </BodySmall>
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
        onPaginationChange={(state: PaginationState) =>
          setPagination({ page: state.pageIndex + 1, pageSize: state.pageSize })
        }
      />
    </div>
  )
}
