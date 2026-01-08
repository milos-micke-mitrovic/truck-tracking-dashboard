import type { ColumnDef } from '@tanstack/react-table'
import { Copy, Check } from 'lucide-react'
import type { Route } from '../types'
import { RouteStatusBadge } from './route-status-badge'
import {
  DataTableColumnHeader,
  BodySmall,
  Caption,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/shared/ui'

type ColumnsConfig = {
  t: (key: string) => string
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getRoutesColumns({
  t,
  copiedId,
  onCopy,
}: ColumnsConfig): ColumnDef<Route>[] {
  return [
    {
      accessorKey: 'routeNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.routeNumber')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <BodySmall as="span" className="font-medium">
              {row.original.routeNumber}
            </BodySmall>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopy(String(row.original.id), row.original.routeNumber)
                  }}
                  className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedId === String(row.original.id) ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedId === String(row.original.id)
                  ? t('actions.copied')
                  : t('actions.copyRouteNumber')}
              </TooltipContent>
            </Tooltip>
          </div>
          <Caption as="span" className="text-muted-foreground">
            {row.original.routeName}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'origin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.origin')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="max-w-[160px] truncate">
            {row.original.origin}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {formatDate(row.original.scheduledStartDate)}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'destination',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.destination')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="max-w-[160px] truncate">
            {row.original.destination}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {formatDate(row.original.scheduledEndDate)}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'distanceMiles',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.distance')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span">
            {row.original.distanceMiles?.toLocaleString() || 0} mi
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            ~{row.original.estimatedDurationHours?.toFixed(1) || 0}h
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.vehicle')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="font-medium">
            {row.original.vehicle?.unitId || '-'}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground max-w-[120px] truncate">
            {row.original.vehicle?.make} {row.original.vehicle?.model}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'driver',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.driver')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="max-w-[120px] truncate">
            {row.original.driver?.name || '-'}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {row.original.driver?.phoneNumber || ''}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.status')} />
      ),
      cell: ({ row }) => (
        <RouteStatusBadge
          status={row.original.status}
          date={row.original.updatedAt}
        />
      ),
    },
  ]
}
