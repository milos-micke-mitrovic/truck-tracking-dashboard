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
import type { TrailerOwnership } from '../../types'
import { OWNERSHIP_VALUES, TRAILER_TYPE_OPTIONS } from '../../constants'

type AddTrailerFormValues = {
  trailerId: string
  type: string
  model: string
  vin: string
  licensePlate: string
  ownership: TrailerOwnership | ''
}

type AddTrailerDialogProps = {
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function AddTrailerDialog({ trigger, onSuccess }: AddTrailerDialogProps) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)

  const form = useForm<AddTrailerFormValues>({
    defaultValues: {
      trailerId: '',
      type: '',
      model: '',
      vin: '',
      licensePlate: '',
      ownership: '',
    },
  })

  const ownershipOptions = OWNERSHIP_VALUES.map((value) => ({
    value,
    label: t(`ownership.${value}`),
  }))

  const typeOptions = [...TRAILER_TYPE_OPTIONS]

  const handleSubmit = async (values: AddTrailerFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Trailer created:', values)

    setOpen(false)
    form.reset()
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('actions.addTrailer')}</DialogTitle>
          <DialogDescription>{t('dialogs.addTrailerDescription')}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trailerId"
              rules={{ required: t('validation.required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.trailerId')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.type')}</FormLabel>
                  <Select
                    options={typeOptions}
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.model')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vin"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.vin')}</FormLabel>
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
              name="licensePlate"
              rules={{ required: t('validation.required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.licensePlate')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.ownership')}</FormLabel>
                  <Select
                    options={ownershipOptions}
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
