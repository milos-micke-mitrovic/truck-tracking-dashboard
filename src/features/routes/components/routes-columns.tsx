import type { ColumnDef } from '@tanstack/react-table'
import { Copy, Check } from 'lucide-react'
import type { RouteShortResponse } from '../types'
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

const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return '-'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getRoutesColumns({
  t,
  copiedId,
  onCopy,
}: ColumnsConfig): ColumnDef<RouteShortResponse>[] {
  return [
    {
      accessorKey: 'brokerIdentifier',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.identifier')}
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <BodySmall as="span" className="font-medium">
              {row.original.brokerIdentifier || '-'}
            </BodySmall>
            {row.original.brokerIdentifier && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCopy(row.original.id, row.original.brokerIdentifier!)
                    }}
                    className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copiedId === row.original.id ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {copiedId === row.original.id
                    ? t('actions.copied')
                    : t('actions.copyIdentifier')}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {row.original.internalIdentifier && (
            <Caption as="span" className="text-muted-foreground">
              {row.original.internalIdentifier}
            </Caption>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'originCity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.origin')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="max-w-[160px] truncate">
            {row.original.originCity || '-'}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {formatDate(row.original.originDate)}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'destinationCity',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.destination')}
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="max-w-[160px] truncate">
            {row.original.destinationCity || '-'}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {formatDate(row.original.destinationDate)}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'brokerRate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.rate')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="font-medium">
            {formatCurrency(row.original.brokerRate)}
            {row.original.ratePerMile != null && (
              <span className="ml-1 font-normal text-muted-foreground">
                ({formatCurrency(row.original.ratePerMile)}/mi)
              </span>
            )}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {row.original.totalMiles != null
              ? `${row.original.totalMiles.toLocaleString()} mi`
              : '-'}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'unitNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.unit')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="font-medium">
            {row.original.unitNumber || '-'}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {row.original.driverName || ''}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'dispatcherName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.dispatcher')}
        />
      ),
      cell: ({ row }) => (
        <BodySmall as="span" className="max-w-[120px] truncate">
          {row.original.dispatcherName || '-'}
        </BodySmall>
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
          date={row.original.bookedAt}
        />
      ),
    },
  ]
}
