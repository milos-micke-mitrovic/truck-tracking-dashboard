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

type AddCompanyFormValues = {
  name: string
  dotNumber: string
  address: string
  phone: string
  emailDomain: string
  fleet: string
  plan: string
}

type AddCompanyDialogProps = {
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function AddCompanyDialog({ trigger, onSuccess }: AddCompanyDialogProps) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)

  const form = useForm<AddCompanyFormValues>({
    defaultValues: {
      name: '',
      dotNumber: '',
      address: '',
      phone: '',
      emailDomain: '',
      fleet: '',
      plan: '',
    },
  })

  const fleetOptions = [
    { value: 'starter', label: 'Starter' },
    { value: 'established', label: t('fleet.established') },
    { value: 'eminent', label: t('fleet.eminent') },
  ]

  const planOptions = [
    { value: 'basic', label: t('plan.basic') },
    { value: 'premium', label: t('plan.premium') },
    { value: 'enterprise', label: t('plan.enterprise') },
  ]

  const handleSubmit = async (values: AddCompanyFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Company created:', values)

    setOpen(false)
    form.reset()
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('actions.addCompany')}</DialogTitle>
          <DialogDescription>{t('dialogs.addCompanyDescription')}</DialogDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dotNumber"
              rules={{ required: t('validation.required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.dotNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.phone')}</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.address')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.emailDomain')}</FormLabel>
                <FormControl>
                  <Input placeholder="company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fleet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.fleet')}</FormLabel>
                  <Select
                    options={fleetOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.plan')}</FormLabel>
                  <Select
                    options={planOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
