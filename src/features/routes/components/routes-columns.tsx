import type { ColumnDef } from '@tanstack/react-table'
import { Copy, Check } from 'lucide-react'
import type { Route } from '../types'
import { RouteStatusBadge } from './route-status-badge'
import { DataTableColumnHeader, BodySmall, Caption } from '@/shared/ui'

type ColumnsConfig = {
  t: (key: string) => string
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

const formatLocation = (city: string, state: string, date: string) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return { location: `${city}, ${state}`, date: formattedDate }
}

export function getRoutesColumns({
  t,
  copiedId,
  onCopy,
}: ColumnsConfig): ColumnDef<Route>[] {
  return [
    {
      accessorKey: 'companyName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.company')} />
      ),
      cell: ({ row }) => (
        <BodySmall as="span" truncate className="max-w-[160px]">
          {row.original.companyName}
        </BodySmall>
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
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <BodySmall as="span" className="font-medium">
              {row.original.identifier}
            </BodySmall>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCopy(row.original.id, row.original.identifier)
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedId === row.original.id ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <Caption as="span" className="text-muted-foreground">
            {row.original.referenceNumber}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'rate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.rate')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="font-medium">
            {formatCurrency(row.original.rate)}
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {formatCurrency(row.original.ratePerMile)}/mi
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'distance',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.trip')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span">
            {row.original.distance.toLocaleString()}mi
          </BodySmall>
          <Caption as="span" className="text-muted-foreground">
            {row.original.stops} {row.original.stops === 1 ? 'stop' : 'stops'}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'originCity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.origin')} />
      ),
      cell: ({ row }) => {
        const { location, date } = formatLocation(
          row.original.originCity,
          row.original.originState,
          row.original.originDate
        )
        return (
          <div className="flex flex-col gap-0.5">
            <BodySmall as="span">{location}</BodySmall>
            <Caption as="span" className="text-muted-foreground">
              {date}
            </Caption>
          </div>
        )
      },
    },
    {
      accessorKey: 'destinationCity',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.destination')}
        />
      ),
      cell: ({ row }) => {
        const { location, date } = formatLocation(
          row.original.destinationCity,
          row.original.destinationState,
          row.original.destinationDate
        )
        return (
          <div className="flex flex-col gap-0.5">
            <BodySmall as="span">{location}</BodySmall>
            <Caption as="span" className="text-muted-foreground">
              {date}
            </Caption>
          </div>
        )
      },
    },
    {
      accessorKey: 'unitNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.unit')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <BodySmall as="span" className="font-medium">
            {row.original.unitNumber}
          </BodySmall>
          <Caption
            as="span"
            className="text-muted-foreground max-w-[120px] truncate"
          >
            {row.original.driverName}
          </Caption>
        </div>
      ),
    },
    {
      accessorKey: 'dispatcher',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.dispatcher')}
        />
      ),
      cell: ({ row }) => (
        <BodySmall as="span">{row.original.dispatcher}</BodySmall>
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
          date={row.original.statusDate}
        />
      ),
    },
  ]
}
