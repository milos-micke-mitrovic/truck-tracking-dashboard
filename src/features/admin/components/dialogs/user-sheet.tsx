import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
} from '@/shared/ui'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Input, Select } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import type { User, Department, UserRole } from '../../types'
import { DEPARTMENT_VALUES, ROLE_VALUES, STATUS_VALUES } from '../../constants'

type UserFormValues = {
  name: string
  username: string
  email: string
  extension: string
  department: Department | ''
  role: UserRole | ''
  status: string
}

type UserSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSuccess?: () => void
}

export function UserSheet({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserSheetProps) {
  const { t } = useTranslation('admin')
  const isEdit = !!user

  const form = useForm<UserFormValues>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      extension: '',
      department: '',
      role: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          extension: user.extension,
          department: user.department,
          role: user.role,
          status: user.status,
        })
      } else {
        form.reset({
          name: '',
          username: '',
          email: '',
          extension: '',
          department: '',
          role: '',
          status: 'active',
        })
      }
    }
  }, [open, user, form])

  const departmentOptions = DEPARTMENT_VALUES.map((value) => ({
    value,
    label: t(`departments.${value}`),
  }))

  const roleOptions = ROLE_VALUES.map((value) => ({
    value,
    label: t(`roles.${value}`),
  }))

  const statusOptions = STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value}`),
  }))

  const handleSubmit = async (values: UserFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'User updated:' : 'User created:', values)

    onOpenChange(false)
    form.reset()
    onSuccess?.()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="xl" className="flex flex-col overflow-hidden p-0">
        <Form
          form={form}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <SheetHeader
            className="border-b px-6 py-3"
            actions={
              <>
                <SheetClose asChild>
                  <Button type="button" variant="outline" size="sm">
                    {t('dialogs.cancel')}
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  size="sm"
                  loading={form.formState.isSubmitting}
                >
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
                  name="name"
                  rules={{ required: t('validation.required') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.name')}</FormLabel>
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
                  rules={{ required: t('validation.required') }}
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
                  rules={{ required: t('validation.required') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="extension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.extension')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <Select
                        options={departmentOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
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
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
