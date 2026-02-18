import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
  Select,
  Caption,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  ConfirmDialog,
} from '@/shared/ui'
import { FormSection, DocumentsSection } from '@/shared/components'
import { getApiErrorMessage, emailValidationRules } from '@/shared/utils'
import { useAuth, getVisibleRoles } from '@/features/auth'
import { useUploadTempFile } from '@/shared/api/documents'
import { adminKeys } from '../../api/keys'
import { useUser, useCreateUser, useUpdateUser, useDeleteUser, useCompanies } from '../../api'
import type {
  User,
  UserRole,
  UserStatus,
  UserFormValues,
  UserSheetProps,
  UserDocumentFormValue,
} from '../../types'
import { ROLE_VALUES, USER_STATUS_VALUES, USER_DOCUMENT_TYPES } from '../../constants'

const getFormDefaults = (user?: User | null): UserFormValues => ({
  companyId: user?.companyId || null,
  email: user?.email || '',
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  username: user?.username || '',
  password: '',
  department: user?.department || '',
  role: user?.role || '',
  status: user?.status || 'ACTIVE',
  documents:
    user?.documents?.map((doc) => ({
      id: doc.id,
      type: doc.type,
      originalFileName: doc.name,
      expirationDate: doc.expirationDate || undefined,
      isNew: false,
    })) || [],
})

export function UserSheet({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: UserSheetProps) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { user: authUser } = useAuth()
  const isEdit = !!userId

  // Fetch full user data when editing
  const { data: user, isLoading: isLoadingUser } = useUser(userId || 0)

  // Fetch companies for selector
  const { data: companiesData } = useCompanies({ size: 100, tenantId: authUser?.tenantId })

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const uploadMutation = useUploadTempFile()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<UserFormValues>({
    defaultValues: getFormDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Track deleted document IDs for existing documents
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])

  // Reset form when sheet opens or user data loads
  useEffect(() => {
    if (open) {
      setDeletedDocumentIds([])
      if (isEdit && user) {
        form.reset(getFormDefaults(user))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, user, form])

  // Track document ID for deletion (used by both remove and file clear)
  const trackDocumentDeletion = (index: number) => {
    const doc = form.getValues(`documents.${index}`)
    if (doc?.id && !deletedDocumentIds.includes(doc.id)) {
      setDeletedDocumentIds((prev) => [...prev, doc.id!])
    }
  }

  // Handle document removal - track IDs of existing documents for deletion
  const handleRemoveDocument = (index: number) => {
    trackDocumentDeletion(index)
    remove(index)
  }

  // Handle file clear - track ID and clear file fields
  const handleFileClear = (index: number) => {
    trackDocumentDeletion(index)
    form.setValue(`documents.${index}.tempFileName`, undefined)
    form.setValue(`documents.${index}.originalFileName`, undefined)
  }

  // Company options
  const companyOptions = useMemo(
    () => [
      { value: '', label: t('userSheet.selectCompany') },
      ...(companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.fullName,
      })),
    ],
    [companiesData, t]
  )

  const roleOptions = getVisibleRoles(ROLE_VALUES, authUser).map((value) => ({
    value,
    label: t(`roles.${value.toLowerCase()}`),
  }))

  const statusOptions = USER_STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value.toLowerCase()}`),
  }))

  // Document type options
  const documentTypeOptions = USER_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`userSheet.documentTypes.${type}`),
  }))

  // Handle file upload for a document
  const handleFileUpload = async (index: number, file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file)
      form.setValue(`documents.${index}.tempFileName`, result.tempFileName)
      form.setValue(
        `documents.${index}.originalFileName`,
        result.originalFileName
      )
      form.setValue(`documents.${index}.isNew`, true)
    } catch {
      toast.error(t('driverDialog.uploadError') || 'Upload failed')
    }
  }

  // Add new document row
  const handleAddDocument = () => {
    append({
      type: '',
      isNew: true,
    } as UserDocumentFormValue)
  }

  const handleSubmit = async (values: UserFormValues) => {
    try {
      // Prepare documents for submission (only new ones with uploads)
      const documentRequests = values.documents
        .filter((doc) => doc.isNew && doc.tempFileName && doc.type)
        .map((doc) => ({
          type: doc.type,
          tempFileName: doc.tempFileName!,
          originalFileName: doc.originalFileName!,
          expirationDate: doc.expirationDate,
        }))

      if (isEdit && userId) {
        if (!authUser?.tenantId) {
          throw new Error('Missing tenant ID')
        }
        if (!values.companyId) {
          throw new Error('Missing company ID')
        }
        await updateMutation.mutateAsync({
          id: userId,
          data: {
            tenantId: authUser.tenantId,
            companyId: values.companyId,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username || undefined,
            password: values.password || undefined,
            department: values.department || undefined,
            role: (values.role as UserRole) || undefined,
            status: values.status as UserStatus,
            documents: documentRequests.length > 0 ? documentRequests : undefined,
            documentIdsToDelete: deletedDocumentIds.length > 0 ? deletedDocumentIds : undefined,
          },
        })
        toast.success(t('userSheet.updateSuccess'))
      } else {
        if (!authUser?.tenantId) {
          throw new Error('Missing tenant ID')
        }
        if (!values.companyId) {
          throw new Error('Missing company ID')
        }
        await createMutation.mutateAsync({
          tenantId: authUser.tenantId,
          companyId: values.companyId,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username || undefined,
          password: values.password,
          department: values.department || undefined,
          role: (values.role as UserRole) || undefined,
          documents: documentRequests.length > 0 ? documentRequests : undefined,
        })
        toast.success(t('userSheet.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('userSheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!userId) return
    try {
      queryClient.removeQueries({ queryKey: adminKeys.user(userId) })
      await deleteMutation.mutateAsync(userId)
      toast.success(t('deleteConfirm.success', { entity: t('tabs.users') }))
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast is handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="xl" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingUser ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('userSheet.editTitle')}</SheetTitle>
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
                      {t('actions.delete')}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      {t('dialogs.cancel')}
                    </Button>
                  </SheetClose>
                  <Button type="submit" size="sm" loading={isLoading}>
                    {t('dialogs.save')}
                  </Button>
                </>
              }
            >
              <SheetTitle>
                {isEdit ? t('userSheet.editTitle') : t('actions.addUser')}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-3 overflow-y-auto px-6 py-4">
              <FormSection title={t('userSheet.accountInfo')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('driverDialog.firstName')}
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
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('driverDialog.lastName')}
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.username')}</FormLabel>
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
                      t('validation.required'),
                      t('validation.emailInvalid')
                    )}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={!isEdit ? { required: t('validation.required') } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={!isEdit}>
                          {t('driverDialog.newPassword')}
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        {isEdit && (
                          <Caption>{t('driverDialog.leaveBlank')}</Caption>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('userSheet.assignment')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyId"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.company')}</FormLabel>
                        <Select
                          options={companyOptions}
                          value={field.value ? String(field.value) : ''}
                          onChange={(v) =>
                            field.onChange(v ? parseInt(v, 10) : null)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('userSheet.roleAndAccess')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.department')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Operations" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.role')}</FormLabel>
                        <Select
                          options={roleOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEdit && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('columns.status')}</FormLabel>
                          <Select
                            options={statusOptions}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </FormSection>

              <DocumentsSection
                control={form.control}
                fields={fields}
                getDocument={(index) => form.watch(`documents.${index}`)}
                documentTypeOptions={documentTypeOptions}
                onFileUpload={handleFileUpload}
                onRemove={handleRemoveDocument}
                onAdd={handleAddDocument}
                onFileClear={handleFileClear}
                isUploading={uploadMutation.isPending}
                entityType="user"
              />
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.user.title')}
          description={t('deleteConfirm.user.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
