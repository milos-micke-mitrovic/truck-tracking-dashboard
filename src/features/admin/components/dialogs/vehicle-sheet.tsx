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
import type { Vehicle, VehicleMake } from '../../types'
import { VEHICLE_MAKE_OPTIONS, STATUS_VALUES } from '../../constants'

type VehicleFormValues = {
  unitNumber: string
  licensePlate: string
  vin: string
  make: VehicleMake | ''
  model: string
  year: string
  status: string
}

type VehicleSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle | null
  onSuccess?: () => void
}

export function VehicleSheet({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: VehicleSheetProps) {
  const { t } = useTranslation('admin')
  const isEdit = !!vehicle

  const form = useForm<VehicleFormValues>({
    defaultValues: {
      unitNumber: '',
      licensePlate: '',
      vin: '',
      make: '',
      model: '',
      year: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      if (vehicle) {
        form.reset({
          unitNumber: vehicle.unitNumber,
          licensePlate: vehicle.licensePlate,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year.toString(),
          status: vehicle.status,
        })
      } else {
        form.reset({
          unitNumber: '',
          licensePlate: '',
          vin: '',
          make: '',
          model: '',
          year: '',
          status: 'active',
        })
      }
    }
  }, [open, vehicle, form])

  const makeOptions = [...VEHICLE_MAKE_OPTIONS]
  const statusOptions = STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value}`),
  }))

  const handleSubmit = async (values: VehicleFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'Vehicle updated:' : 'Vehicle created:', values)

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
              {isEdit ? t('vehicleSheet.editTitle') : t('actions.addVehicle')}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3 overflow-y-auto px-6 py-4">
            <FormSection title={t('vehicleSheet.identification')}>
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="unitNumber"
                  rules={{ required: t('validation.required') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.unitNumber')}</FormLabel>
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

            <FormSection title={t('vehicleSheet.specifications')}>
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.make')}</FormLabel>
                      <Select
                        options={makeOptions}
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('columns.year')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2024" {...field} />
                      </FormControl>
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
