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
import type { Trailer, TrailerOwnership } from '../../types'
import {
  OWNERSHIP_VALUES,
  TRAILER_TYPE_OPTIONS,
  STATUS_VALUES,
} from '../../constants'

type TrailerFormValues = {
  trailerId: string
  type: string
  model: string
  vin: string
  licensePlate: string
  ownership: TrailerOwnership | ''
  status: string
}

type TrailerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trailer?: Trailer | null
  onSuccess?: () => void
}

export function TrailerSheet({
  open,
  onOpenChange,
  trailer,
  onSuccess,
}: TrailerSheetProps) {
  const { t } = useTranslation('admin')
  const isEdit = !!trailer

  const form = useForm<TrailerFormValues>({
    defaultValues: {
      trailerId: '',
      type: '',
      model: '',
      vin: '',
      licensePlate: '',
      ownership: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      if (trailer) {
        form.reset({
          trailerId: trailer.trailerId,
          type: trailer.type,
          model: trailer.model,
          vin: trailer.vin,
          licensePlate: trailer.licensePlate,
          ownership: trailer.ownership,
          status: trailer.status,
        })
      } else {
        form.reset({
          trailerId: '',
          type: '',
          model: '',
          vin: '',
          licensePlate: '',
          ownership: '',
          status: 'active',
        })
      }
    }
  }, [open, trailer, form])

  const ownershipOptions = OWNERSHIP_VALUES.map((value) => ({
    value,
    label: t(`ownership.${value}`),
  }))

  const typeOptions = [...TRAILER_TYPE_OPTIONS]

  const statusOptions = STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value}`),
  }))

  const handleSubmit = async (values: TrailerFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'Trailer updated:' : 'Trailer created:', values)

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
              {isEdit ? t('trailerSheet.editTitle') : t('actions.addTrailer')}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3 overflow-y-auto px-6 py-4">
            <FormSection title={t('trailerSheet.identification')}>
              <div className="grid gap-3 md:grid-cols-2">
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
                  name="vin"
                  rules={{ required: t('validation.required') }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t('columns.vin')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection title={t('trailerSheet.specifications')}>
              <div className="grid gap-3 md:grid-cols-2">
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
