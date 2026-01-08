import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table'
import { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import { Spinner } from '../spinner'
import { BodySmall } from '../typography'
import { DataTablePagination } from './data-table-pagination'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean
  pageSize?: number
  pageIndex?: number
  pageSizeOptions?: number[]
  manualPagination?: boolean
  pageCount?: number
  totalCount?: number
  onPaginationChange?: (pagination: PaginationState) => void
  manualSorting?: boolean
  onSortingChange?: (sorting: SortingState) => void
  loading?: boolean
  isLoading?: boolean
  emptyText?: string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageIndex: initialPageIndex = 0,
  pageSizeOptions = [10, 20, 50, 100],
  manualPagination = false,
  pageCount,
  totalCount,
  onPaginationChange,
  manualSorting = false,
  onSortingChange,
  loading = false,
  isLoading = false,
  emptyText = 'No results.',
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  })

  const isTableLoading = loading || isLoading

  // Keep previous data visible during loading
  const previousDataRef = useRef<TData[]>(data)
  useEffect(() => {
    if (!isTableLoading && data.length > 0) {
      previousDataRef.current = data
    }
  }, [data, isTableLoading])

  // Use previous data while loading, current data otherwise
  const displayData = isTableLoading && data.length === 0 ? previousDataRef.current : data

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(paginationState) : updater
      setPaginationState(newPagination)
      onPaginationChange?.(newPagination)
    },
    manualPagination,
    manualSorting,
    pageCount: manualPagination ? pageCount : undefined,
    state: {
      sorting,
      columnFilters,
      pagination: paginationState,
    },
  })

  const showEmptyState = !isTableLoading && !table.getRowModel().rows?.length

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={
                    onRowClick ? 'hover:bg-muted/50 cursor-pointer' : undefined
                  }
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24" />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Loading overlay with backdrop */}
        {isTableLoading && (
          <div className="absolute inset-0 top-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Spinner />
          </div>
        )}
        {/* Empty state */}
        {showEmptyState && (
          <div className="pointer-events-none absolute inset-0 top-10 flex items-center justify-center">
            <BodySmall color="muted">{emptyText}</BodySmall>
          </div>
        )}
      </div>

      {pagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          totalCount={totalCount}
        />
      )}
    </div>
  )
}
