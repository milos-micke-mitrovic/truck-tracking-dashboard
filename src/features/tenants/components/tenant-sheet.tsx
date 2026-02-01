import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
  Spinner,
  Input,
  Switch,
  Badge,
  ConfirmDialog,
  Muted,
} from '@/shared/ui'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/components'
import { getApiErrorMessage } from '@/shared/utils'
import {
  tenantKeys,
  useTenant,
  useTenantAdmins,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from '../api'
import { AdminSheet } from './admin-sheet'
import type { Tenant, TenantRequest, TenantAdmin } from '../types'

type TenantSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId?: number | null
}

type TenantFormValues = {
  name: string
  code: string
  isActive: boolean
}

const getFormDefaults = (tenant?: Tenant | null): TenantFormValues => ({
  name: tenant?.name || '',
  code: tenant?.code || '',
  isActive: tenant?.isActive ?? true,
})

export function TenantSheet({
  open,
  onOpenChange,
  tenantId,
}: TenantSheetProps) {
  const { t } = useTranslation('tenants')
  const queryClient = useQueryClient()
  const isEdit = !!tenantId

  const { data: tenant, isLoading: isLoadingTenant } = useTenant(tenantId || 0)

  const createMutation = useCreateTenant()
  const updateMutation = useUpdateTenant()
  const deleteMutation = useDeleteTenant()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminSheetOpen, setAdminSheetOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<TenantAdmin | null>(null)

  const { data: admins, isLoading: isLoadingAdmins } = useTenantAdmins(
    tenantId || 0
  )

  const form = useForm<TenantFormValues>({
    defaultValues: getFormDefaults(),
  })

  useEffect(() => {
    if (open) {
      if (isEdit && tenant) {
        form.reset(getFormDefaults(tenant))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, tenant, form])

  const handleSubmit = async (values: TenantFormValues) => {
    try {
      const data: TenantRequest = {
        name: values.name,
        code: values.code,
        isActive: values.isActive,
      }

      if (isEdit && tenantId) {
        await updateMutation.mutateAsync({ id: tenantId, data })
        toast.success(t('sheet.updateSuccess'))
      } else {
        await createMutation.mutateAsync(data)
        toast.success(t('sheet.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('sheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!tenantId) return
    try {
      queryClient.removeQueries({ queryKey: tenantKeys.detail(tenantId) })
      await deleteMutation.mutateAsync(tenantId)
      toast.success(t('deleteConfirm.success'))
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast is handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingTenant ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('sheet.editTitle')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 items-center justify-center">
              <Spinner size="lg" />
            </div>
          </>
        ) : (
          <Form
            form={form}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <SheetHeader
              className="border-b px-6 py-3"
              actions={
                <>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {t('sheet.delete')}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      {t('sheet.cancel')}
                    </Button>
                  </SheetClose>
                  <Button type="submit" size="sm" loading={isLoading}>
                    {t('sheet.save')}
                  </Button>
                </>
              }
            >
              <SheetTitle>
                {isEdit ? t('sheet.editTitle') : t('sheet.addTitle')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <FormSection title={t('sheet.editTitle')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('sheet.name')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Acme Corp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('sheet.code')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. ACME" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            label={t('sheet.isActive')}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              {isEdit && (
                <FormSection
                  title={t('admins.title')}
                  actions={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(null)
                        setAdminSheetOpen(true)
                      }}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      {t('admins.addAdmin')}
                    </Button>
                  }
                >
                  {isLoadingAdmins ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner />
                    </div>
                  ) : !admins?.length ? (
                    <Muted className="py-4 text-center">
                      {t('admins.empty')}
                    </Muted>
                  ) : (
                    <div className="divide-y rounded-md border">
                      {admins.map((admin) => (
                        <button
                          key={admin.id}
                          type="button"
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/50"
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setAdminSheetOpen(true)
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-muted-foreground truncate text-xs">
                              {admin.email}
                            </div>
                          </div>
                          <Badge
                            color={
                              admin.status === 'ACTIVE' ? 'success' : 'muted'
                            }
                          >
                            {admin.status === 'ACTIVE'
                              ? t('status.active')
                              : t('status.inactive')}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </FormSection>
              )}
            </div>
          </Form>
        )}

        {isEdit && tenantId && (
          <AdminSheet
            open={adminSheetOpen}
            onOpenChange={setAdminSheetOpen}
            tenantId={tenantId}
            admin={selectedAdmin}
          />
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.title')}
          description={t('deleteConfirm.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
