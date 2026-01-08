import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useRoutes } from '../api'
import type { Route, RouteFilters, RouteStatus } from '../types'
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
  })

  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
  })

  const { data, isLoading, isFetching } = useRoutes({
    ...filters,
    ...pagination,
  })

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

  const statusOptions = [
    { value: 'all', label: t('filters.all') },
    ...ROUTE_STATUS_VALUES.map((value) => ({
      value,
      label: t(`status.${value.toLowerCase()}`),
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
          <Input
            placeholder={t('filters.search')}
            value={filters.searchTerm || ''}
            debounce={300}
            onDebounceChange={(value) => updateFilter('searchTerm', value)}
            clearable
            className="w-[200px]"
          />
          <Select
            options={statusOptions}
            value={filters.status || 'all'}
            onChange={(value) =>
              updateFilter('status', value as RouteStatus | 'all')
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
        route={selectedRoute}
      />
    </div>
  )
}
