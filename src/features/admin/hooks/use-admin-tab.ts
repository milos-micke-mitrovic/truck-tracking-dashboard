import { useState, useCallback } from 'react'
import type { PaginationState } from '@tanstack/react-table'

type UseAdminTabOptions<TFilters> = {
  defaultFilters: TFilters
  defaultPagination?: { page: number; size: number }
}

type UseAdminTabReturn<TFilters, TItem> = {
  filters: TFilters
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>
  updateFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void
  pagination: { page: number; size: number } // 0-based page for Spring Boot
  setPagination: React.Dispatch<
    React.SetStateAction<{ page: number; size: number }>
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
  defaultPagination = { page: 0, size: 20 },
}: UseAdminTabOptions<TFilters>): UseAdminTabReturn<TFilters, TItem> {
  const [filters, setFilters] = useState<TFilters>(defaultFilters)
  const [pagination, setPagination] = useState(defaultPagination)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null)

  const updateFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPagination((prev) => ({ ...prev, page: 0 })) // Reset to first page
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
