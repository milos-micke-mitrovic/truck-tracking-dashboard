import { useState, useCallback } from 'react'
import type { PaginationState } from '@tanstack/react-table'

type UseAdminTabOptions<TFilters> = {
  defaultFilters: TFilters
  defaultPagination?: { page: number; pageSize: number }
}

type UseAdminTabReturn<TFilters, TItem> = {
  filters: TFilters
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>
  updateFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void
  pagination: { page: number; pageSize: number }
  setPagination: React.Dispatch<
    React.SetStateAction<{ page: number; pageSize: number }>
  >
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
  defaultPagination = { page: 1, pageSize: 20 },
}: UseAdminTabOptions<TFilters>): UseAdminTabReturn<TFilters, TItem> {
  const [filters, setFilters] = useState<TFilters>(defaultFilters)
  const [pagination, setPagination] = useState(defaultPagination)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null)

  const updateFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
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
    setPagination({ page: state.pageIndex + 1, pageSize: state.pageSize })
  }, [])

  return {
    filters,
    setFilters,
    updateFilter,
    pagination,
    setPagination,
    dialogOpen,
    setDialogOpen,
    selectedItem,
    setSelectedItem,
    handleAdd,
    handleRowClick,
    handlePaginationChange,
  }
}
