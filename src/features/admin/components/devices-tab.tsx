import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Plus, ShoppingCart } from 'lucide-react'
import {
  useEldDevices,
  usePortableDevices,
  useGpsDevices,
  useCameraDevices,
} from '../api'
import type {
  EldDevice,
  PortableDevice,
  GpsDevice,
  CameraDevice,
  EldDeviceFilters,
  PortableDeviceFilters,
  GpsDeviceFilters,
  CameraDeviceFilters,
} from '../types'
import { AdminToolbar } from './admin-toolbar'
import { StatusBadge } from './status-badge'
import {
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui'
import { FormSelect } from '@/shared/ui/form-fields'
import { DataTable, DataTableColumnHeader } from '@/shared/ui'
import { drivers } from '@/mocks/data'
import { vehicles } from '@/mocks/data'

// ELD Devices Sub-tab
function EldDevicesSubTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<EldDeviceFilters>({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

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
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
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
        <span className="font-mono text-xs">{row.original.serialNumber}</span>
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
        <span className="font-mono text-xs">
          {row.original.macAddress || '-'}
        </span>
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
              onChange={(e) =>
                setFilters((f) => ({ ...f, serialNumber: e.target.value }))
              }
              className="w-full sm:max-w-[180px]"
            />
            <Input
              placeholder={t('filters.macAddress')}
              value={filters.macAddress || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, macAddress: e.target.value }))
              }
              className="w-full sm:max-w-[180px]"
            />
          </>
        }
        addButton={
          <>
            <Button size="sm" variant="default">
              <ShoppingCart className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('actions.order')}</span>
            </Button>
            <Button size="sm">
              <Plus className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {t('actions.addEldDevice')}
              </span>
            </Button>
          </>
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

// Portable Devices Sub-tab
function PortableDevicesSubTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<PortableDeviceFilters>({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

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
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
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
        <span className="max-w-[160px] truncate font-mono text-xs">
          {row.original.identifier}
        </span>
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
          <FormSelect
            options={driverOptions}
            value={filters.driverId || 'all'}
            onChange={(value) =>
              setFilters((f) => ({
                ...f,
                driverId: value as PortableDeviceFilters['driverId'],
              }))
            }
            label={t('filters.driver')}
          />
        }
        addButton={
          <Button size="sm" variant="default">
            <ShoppingCart className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.order')}</span>
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

// GPS Devices Sub-tab
function GpsDevicesSubTab() {
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
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
      ),
    },
    {
      accessorKey: 'serialNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.snNumber')} />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.serialNumber}</span>
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
            onChange={(e) =>
              setFilters((f) => ({ ...f, serialNumber: e.target.value }))
            }
            className="w-full sm:max-w-[200px]"
          />
        }
        addButton={
          <Button size="sm" variant="default">
            <ShoppingCart className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.order')}</span>
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

// Camera Devices Sub-tab
function CameraDevicesSubTab() {
  const { t } = useTranslation('admin')
  const [filters, setFilters] = useState<CameraDeviceFilters>({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })

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
        <span className="max-w-[180px] truncate">
          {row.original.companyName}
        </span>
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
        <span className="font-mono text-xs">{row.original.serialNumber}</span>
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
          <FormSelect
            options={vehicleOptions}
            value={filters.vehicleId || 'all'}
            onChange={(value) =>
              setFilters((f) => ({
                ...f,
                vehicleId: value as CameraDeviceFilters['vehicleId'],
              }))
            }
            label={t('filters.vehicle')}
          />
        }
        addButton={
          <Button size="sm" variant="default">
            <ShoppingCart className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.order')}</span>
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

// Main Devices Tab with sub-tabs
export function DevicesTab() {
  const { t } = useTranslation('admin')

  return (
    <Tabs defaultValue="eld" className="w-full">
      <TabsList>
        <TabsTrigger value="eld">{t('deviceTabs.eld')}</TabsTrigger>
        <TabsTrigger value="portable">{t('deviceTabs.portable')}</TabsTrigger>
        <TabsTrigger value="gps">{t('deviceTabs.gps')}</TabsTrigger>
        <TabsTrigger value="camera">{t('deviceTabs.camera')}</TabsTrigger>
      </TabsList>
      <TabsContent value="eld">
        <EldDevicesSubTab />
      </TabsContent>
      <TabsContent value="portable">
        <PortableDevicesSubTab />
      </TabsContent>
      <TabsContent value="gps">
        <GpsDevicesSubTab />
      </TabsContent>
      <TabsContent value="camera">
        <CameraDevicesSubTab />
      </TabsContent>
    </Tabs>
  )
}
