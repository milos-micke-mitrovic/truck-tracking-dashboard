import { useState, useCallback } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'

type SortParams = {
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

type UseAdminTabOptions<TFilters> = {
  defaultFilters: TFilters
  defaultPagination?: { page: number; size: number }
}

type UseAdminTabReturn<TFilters, TItem> = {
  filters: TFilters
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>
  updateFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void
  pagination: { page: number; size: number }
  setPagination: React.Dispatch<
    React.SetStateAction<{ page: number; size: number }>
  >
  sorting: SortParams
  handleSortingChange: (state: SortingState) => void
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: TItem | null
  setSelectedItem: React.Dispatch<React.SetStateAction<TItem | null>>
  handleAdd: () => void
  handleRowClick: (item: TItem) => void
  handlePaginationChange: (state: PaginationState) => void
}

export function useAdminTab<TFilters, TItem>({
  defaultFilters,
  defaultPagination = { page: 0, size: 20 },
}: UseAdminTabOptions<TFilters>): UseAdminTabReturn<TFilters, TItem> {
  const [filters, setFilters] = useState<TFilters>(defaultFilters)
  const [pagination, setPagination] = useState(defaultPagination)
  const [sorting, setSorting] = useState<SortParams>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null)

  const updateFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPagination((prev) => ({ ...prev, page: 0 }))
    },
    []
  )

  const handleAdd = useCallback(() => {
    setSelectedItem(null)
    setDialogOpen(true)
  }, [])

  const handleRowClick = useCallback((item: TItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }, [])

  const handlePaginationChange = useCallback((state: PaginationState) => {
    setPagination({ page: state.pageIndex, size: state.pageSize })
  }, [])

  const handleSortingChange = useCallback((state: SortingState) => {
    if (state.length > 0) {
      setSorting({ sortBy: state[0].id, sortDir: state[0].desc ? 'desc' : 'asc' })
    } else {
      setSorting({})
    }
    setPagination((prev) => ({ ...prev, page: 0 }))
  }, [])

  return {
    filters,
    setFilters,
    updateFilter,
    pagination,
    setPagination,
    sorting,
    handleSortingChange,
    dialogOpen,
    setDialogOpen,
    selectedItem,
    setSelectedItem,
    handleAdd,
    handleRowClick,
    handlePaginationChange,
  }
}
