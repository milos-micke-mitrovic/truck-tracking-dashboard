import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { Department, UserRole } from '../../types'
import { DEPARTMENT_VALUES, ROLE_VALUES } from '../../constants'

type AddUserFormValues = {
  name: string
  username: string
  email: string
  extension: string
  department: Department | ''
  role: UserRole | ''
}

type AddUserDialogProps = {
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function AddUserDialog({ trigger, onSuccess }: AddUserDialogProps) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)

  const form = useForm<AddUserFormValues>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      extension: '',
      department: '',
      role: '',
    },
  })

  const departmentOptions = DEPARTMENT_VALUES.map((value) => ({
    value,
    label: t(`departments.${value}`),
  }))

  const roleOptions = ROLE_VALUES.map((value) => ({
    value,
    label: t(`roles.${value}`),
  }))

  const handleSubmit = async (values: AddUserFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('User created:', values)

    setOpen(false)
    form.reset()
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('actions.addUser')}</DialogTitle>
          <DialogDescription>{t('dialogs.addUserDescription')}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={handleSubmit} className="grid gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('dialogs.cancel')}
            </Button>
            <Button type="submit" loading={form.formState.isSubmitting}>
              {t('dialogs.save')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
