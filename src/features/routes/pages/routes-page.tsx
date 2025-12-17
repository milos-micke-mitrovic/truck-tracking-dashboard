import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useRoutes, useCompaniesForRoutes } from '../api'
import type { Route, RouteFilters } from '../types'
import { ROUTE_STATUS_VALUES } from '../constants'
import { RouteSheet } from '../components/route-sheet'
import { getRoutesColumns } from '../components/routes-columns'
import { Button, Input, Select, DataTable, H1 } from '@/shared/ui'

export function RoutesPage() {
  const { t } = useTranslation('routes')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [routeSheetOpen, setRouteSheetOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  const [filters, setFilters] = useState<RouteFilters>({
    status: 'all',
    company: 'all',
  })

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  })

  const { data, isLoading, refetch } = useRoutes({
    ...filters,
    ...pagination,
  })

  const { data: companies } = useCompaniesForRoutes()

  const updateFilter = <K extends keyof RouteFilters>(
    key: K,
    value: RouteFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePaginationChange = useCallback((state: PaginationState) => {
    setPagination({
      page: state.pageIndex + 1,
      pageSize: state.pageSize,
    })
  }, [])

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRowClick = (route: Route) => {
    setSelectedRoute(route)
    setRouteSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setRouteSheetOpen(open)
    if (!open) {
      setSelectedRoute(null)
    }
  }

  const companyOptions = [
    { value: 'all', label: t('filters.all') },
    ...(companies?.map((c) => ({ value: c.id, label: c.name })) || []),
  ]

  const statusOptions = [
    { value: 'all', label: t('filters.all') },
    ...ROUTE_STATUS_VALUES.map((value) => ({
      value,
      label: t(`status.${value}`),
    })),
  ]

  const columns = useMemo(
    () => getRoutesColumns({ t, copiedId, onCopy: handleCopy }),
    [t, copiedId]
  )

  return (
    <div className="flex flex-col gap-6">
      <H1>{t('title')}</H1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 py-3">
          <Select
            options={companyOptions}
            value={filters.company || 'all'}
            onChange={(value) => updateFilter('company', value)}
            className="w-[160px]"
          />
          <Input
            placeholder={t('filters.identifier')}
            value={filters.identifier || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('identifier', value)}
            className="w-[140px]"
          />
          <Input
            placeholder={t('filters.rate')}
            value={filters.rate || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('rate', value)}
            className="w-[120px]"
          />
          <Input
            placeholder={t('filters.trip')}
            value={filters.trip || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('trip', value)}
            className="w-[100px]"
          />
          <Select
            options={statusOptions}
            value={filters.status || 'all'}
            onChange={(value) =>
              updateFilter('status', value as RouteFilters['status'])
            }
            className="w-[140px]"
          />

          <div className="flex-1" />

          <Button
            size="sm"
            prefixIcon={<Plus />}
            onClick={() => {
              setSelectedRoute(null)
              setRouteSheetOpen(true)
            }}
          >
            {t('actions.addRoute')}
          </Button>
        </div>

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
          onRowClick={handleRowClick}
        />
      </div>

      <RouteSheet
        open={routeSheetOpen}
        onOpenChange={handleSheetOpenChange}
        route={selectedRoute}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
