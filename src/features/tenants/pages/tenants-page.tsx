import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTenants, useSearchTenants } from '../api'
import type { Tenant } from '../types'
import { TenantSheet } from '../components/tenant-sheet'
import {
  H1,
  Badge,
  Button,
  Input,
  DataTable,
  DataTableColumnHeader,
} from '@/shared/ui'
import { formatDate } from '@/shared/utils'

export function TenantsPage() {
  const { t } = useTranslation('tenants')

  const [search, setSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  const { data: allTenants, isLoading } = useTenants()
  const { data: searchResults, isFetching: isSearching } =
    useSearchTenants(search)

  const tenants = search ? searchResults : allTenants

  const handleRowClick = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setSheetOpen(true)
  }

  const handleAdd = () => {
    setSelectedTenant(null)
    setSheetOpen(true)
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setSelectedTenant(null)
    }
  }

  const columns: ColumnDef<Tenant>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.name')} />
        ),
      },
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.code')} />
        ),
      },
      {
        accessorKey: 'isActive',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columns.status')} />
        ),
        cell: ({ row }) => (
          <Badge color={row.original.isActive ? 'success' : 'muted'}>
            {row.original.isActive
              ? t('status.active')
              : t('status.inactive')}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('columns.createdAt')}
          />
        ),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('columns.updatedAt')}
          />
        ),
        cell: ({ row }) => formatDate(row.original.updatedAt),
      },
    ],
    [t]
  )

  return (
    <div className="flex flex-col gap-6">
      <H1>{t('title')}</H1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 py-3">
          <Input
            placeholder={t('filters.search')}
            value={search}
            debounce={300}
            onDebounceChange={setSearch}
            clearable
            className="w-[250px]"
          />
          <div className="flex-1" />
          <Button size="sm" prefixIcon={<Plus />} onClick={handleAdd}>
            {t('actions.addTenant')}
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={tenants || []}
          isLoading={isLoading || isSearching}
          onRowClick={handleRowClick}
        />
      </div>

      <TenantSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        tenantId={selectedTenant?.id}
      />
    </div>
  )
}
