import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useRoutes } from '../api'
import type { RouteFilters, RouteStatus } from '../types'
import { ROUTE_STATUS_VALUES } from '../constants'
import { RouteSheet } from '../components/route-sheet'
import { getRoutesColumns } from '../components/routes-columns'
import {
  Button,
  Input,
  Select,
  DatePicker,
  DataTable,
  H1,
  FilterToggle,
  type FilterConfig,
} from '@/shared/ui'
import { useFilterVisibility } from '@/shared/hooks'
import { useCompanies, useDrivers, useVehicles, useUsers } from '@/features/admin/api'
import { useBrokers } from '@/features/brokers'

// All available filters
const ROUTE_FILTERS: FilterConfig[] = [
  { key: 'identifier', labelKey: 'filters.identifier' },
  { key: 'status', labelKey: 'filters.status' },
  { key: 'companyId', labelKey: 'filters.companyId' },
  { key: 'dispatcherId', labelKey: 'filters.dispatcherId' },
  { key: 'driverId', labelKey: 'filters.driverId' },
  { key: 'vehicleId', labelKey: 'filters.vehicleId' },
  { key: 'brokerId', labelKey: 'filters.brokerId' },
  { key: 'bookedAtFrom', labelKey: 'filters.bookedAtFrom' },
  { key: 'bookedAtTo', labelKey: 'filters.bookedAtTo' },
]

const DEFAULT_VISIBLE = ['identifier', 'status']

export function RoutesPage() {
  const { t } = useTranslation('routes')
  const { visibleFilters, toggleFilter, isFilterVisible } =
    useFilterVisibility({
      storageKey: 'routes',
      defaultVisible: DEFAULT_VISIBLE,
    })

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [routeSheetOpen, setRouteSheetOpen] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  const [filters, setFilters] = useState<RouteFilters>({
    status: 'all',
  })

  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
  })

  const { data, isLoading, isFetching } = useRoutes({
    ...filters,
    ...pagination,
  })

  // Fetch data for searchable selects
  const { data: companiesData } = useCompanies({ size: 100 })
  const { data: usersData } = useUsers({ size: 100 })
  const { data: driversData } = useDrivers({ size: 100 })
  const { data: vehiclesData } = useVehicles({ size: 100 })
  const { data: brokersData } = useBrokers()

  const updateFilter = <K extends keyof RouteFilters>(
    key: K,
    value: RouteFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 0 }))
  }

  const handlePaginationChange = useCallback((state: PaginationState) => {
    setPagination({
      page: state.pageIndex,
      size: state.pageSize,
    })
  }, [])

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRowClick = (route: { id: string }) => {
    setSelectedRouteId(route.id)
    setRouteSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setRouteSheetOpen(open)
    if (!open) {
      setSelectedRouteId(null)
    }
  }

  const statusOptions = [
    { value: 'all', label: t('filters.all') },
    ...ROUTE_STATUS_VALUES.map((value) => ({
      value,
      label: t(`status.${value}`),
    })),
  ]

  const companyOptions = useMemo(
    () =>
      (companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.displayName || c.fullName,
      })),
    [companiesData]
  )

  const dispatcherOptions = useMemo(
    () =>
      (usersData?.content || []).map((u) => ({
        value: String(u.id),
        label: u.name,
      })),
    [usersData]
  )

  const driverOptions = useMemo(
    () =>
      (driversData?.content || []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    [driversData]
  )

  const vehicleOptions = useMemo(
    () =>
      (vehiclesData?.content || []).map((v) => ({
        value: String(v.id),
        label: v.unitId,
      })),
    [vehiclesData]
  )

  const brokerOptions = useMemo(
    () =>
      (brokersData || []).map((b) => ({
        value: String(b.id),
        label: b.legalName || b.dbaName || b.mcNumber,
      })),
    [brokersData]
  )

  const columns = useMemo(
    () => getRoutesColumns({ t, copiedId, onCopy: handleCopy }),
    [t, copiedId]
  )

  return (
    <div className="flex flex-col gap-6">
      <H1>{t('title')}</H1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 py-3">
          {isFilterVisible('identifier') && (
            <Input
              placeholder={t('filters.identifier')}
              value={filters.identifier || ''}
              debounce={300}
              onDebounceChange={(value) => updateFilter('identifier', value)}
              clearable
              className="w-[200px]"
            />
          )}
          {isFilterVisible('status') && (
            <Select
              options={statusOptions}
              value={filters.status || 'all'}
              onChange={(value) =>
                updateFilter('status', value as RouteStatus | 'all')
              }
              className="w-[140px]"
            />
          )}
          {isFilterVisible('companyId') && (
            <Select
              searchable
              options={companyOptions}
              value={filters.companyId || ''}
              onChange={(value) => updateFilter('companyId', value)}
              placeholder={t('filters.companyId')}
              className="w-[160px]"
            />
          )}
          {isFilterVisible('dispatcherId') && (
            <Select
              searchable
              options={dispatcherOptions}
              value={filters.dispatcherId || ''}
              onChange={(value) => updateFilter('dispatcherId', value)}
              placeholder={t('filters.dispatcherId')}
              className="w-[160px]"
            />
          )}
          {isFilterVisible('driverId') && (
            <Select
              searchable
              options={driverOptions}
              value={filters.driverId || ''}
              onChange={(value) => updateFilter('driverId', value)}
              placeholder={t('filters.driverId')}
              className="w-[160px]"
            />
          )}
          {isFilterVisible('vehicleId') && (
            <Select
              searchable
              options={vehicleOptions}
              value={filters.vehicleId || ''}
              onChange={(value) => updateFilter('vehicleId', value)}
              placeholder={t('filters.vehicleId')}
              className="w-[140px]"
            />
          )}
          {isFilterVisible('brokerId') && (
            <Select
              searchable
              options={brokerOptions}
              value={filters.brokerId || ''}
              onChange={(value) => updateFilter('brokerId', value)}
              placeholder={t('filters.brokerId')}
              className="w-[160px]"
            />
          )}
          {isFilterVisible('bookedAtFrom') && (
            <DatePicker
              value={filters.bookedAtFrom || ''}
              onChange={(value) =>
                updateFilter('bookedAtFrom', value ? String(value) : undefined)
              }
              placeholder={t('filters.bookedAtFrom')}
            />
          )}
          {isFilterVisible('bookedAtTo') && (
            <DatePicker
              value={filters.bookedAtTo || ''}
              onChange={(value) =>
                updateFilter('bookedAtTo', value ? String(value) : undefined)
              }
              placeholder={t('filters.bookedAtTo')}
            />
          )}
          <FilterToggle
            filters={ROUTE_FILTERS}
            visibleFilters={visibleFilters}
            onToggleFilter={toggleFilter}
            namespace="routes"
          />

          <div className="flex-1" />

          <Button
            size="sm"
            prefixIcon={<Plus />}
            onClick={() => {
              setSelectedRouteId(null)
              setRouteSheetOpen(true)
            }}
          >
            {t('actions.addRoute')}
          </Button>
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
      </div>

      <RouteSheet
        open={routeSheetOpen}
        onOpenChange={handleSheetOpenChange}
        routeId={selectedRouteId}
      />
    </div>
  )
}
