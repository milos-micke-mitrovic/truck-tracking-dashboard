import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
  Spinner,
  Input,
  Caption,
  ConfirmDialog,
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
import { getApiErrorMessage, emailValidationRules } from '@/shared/utils'
import { tenantKeys } from '../api'
import {
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/admin/api'
import { adminKeys } from '@/features/admin/api/keys'
import type { TenantAdmin } from '../types'

type AdminSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: number
  admin?: TenantAdmin | null
}

type AdminFormValues = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  department: string
}

const getFormDefaults = (): AdminFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  department: '',
})

export function AdminSheet({
  open,
  onOpenChange,
  tenantId,
  admin,
}: AdminSheetProps) {
  const { t } = useTranslation('tenants')
  const queryClient = useQueryClient()
  const isEdit = !!admin

  // Fetch full user data when editing (admin list only has short DTO)
  const { data: fullUser, isLoading: isLoadingUser } = useUser(admin?.id || 0)

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<AdminFormValues>({
    defaultValues: getFormDefaults(),
  })

  useEffect(() => {
    if (open) {
      if (isEdit && fullUser) {
        form.reset({
          firstName: fullUser.firstName || '',
          lastName: fullUser.lastName || '',
          email: fullUser.email || '',
          username: fullUser.username || '',
          password: '',
          department: fullUser.department || '',
        })
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, fullUser, form])

  const invalidateAdmins = () => {
    queryClient.invalidateQueries({ queryKey: tenantKeys.admins(tenantId) })
  }

  const handleSubmit = async (values: AdminFormValues) => {
    try {
      if (isEdit && admin) {
        await updateMutation.mutateAsync({
          id: admin.id,
          data: {
            tenantId,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username || undefined,
            password: values.password || undefined,
            department: values.department || undefined,
            role: 'ADMIN',
          },
        })
        toast.success(t('adminSheet.updateSuccess'))
      } else {
        await createMutation.mutateAsync({
          tenantId,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          username: values.username || undefined,
          department: values.department || undefined,
          role: 'ADMIN',
        })
        toast.success(t('adminSheet.createSuccess'))
      }

      invalidateAdmins()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('adminSheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!admin) return
    try {
      queryClient.removeQueries({ queryKey: adminKeys.user(admin.id) })
      await deleteMutation.mutateAsync(admin.id)
      toast.success(t('deleteConfirm.adminSuccess'))
      invalidateAdmins()
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast is handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingUser ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('adminSheet.editTitle')}</SheetTitle>
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
                      {t('adminSheet.delete')}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      {t('adminSheet.cancel')}
                    </Button>
                  </SheetClose>
                  <Button type="submit" size="sm" loading={isLoading}>
                    {t('adminSheet.save')}
                  </Button>
                </>
              }
            >
              <SheetTitle>
                {isEdit ? t('adminSheet.editTitle') : t('adminSheet.addTitle')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <FormSection title={t('adminSheet.editTitle')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('adminSheet.firstName')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('adminSheet.lastName')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={emailValidationRules(
                      t('adminSheet.email'),
                      t('adminSheet.email')
                    )}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('adminSheet.email')}
                        </FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adminSheet.username')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={!isEdit ? { required: true } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={!isEdit}>
                          {t('adminSheet.password')}
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        {isEdit && (
                          <Caption>{t('adminSheet.leaveBlank')}</Caption>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adminSheet.department')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.adminTitle')}
          description={t('deleteConfirm.adminDescription')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
