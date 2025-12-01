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

type DeviceType = 'eld' | 'portable' | 'gps' | 'camera'

type OrderDeviceFormValues = {
  quantity: string
  manufacturer: string
  model: string
  notes: string
}

type OrderDeviceDialogProps = {
  trigger: React.ReactNode
  deviceType: DeviceType
  onSuccess?: () => void
}

export function OrderDeviceDialog({
  trigger,
  deviceType,
  onSuccess,
}: OrderDeviceDialogProps) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)

  const form = useForm<OrderDeviceFormValues>({
    defaultValues: {
      quantity: '1',
      manufacturer: '',
      model: '',
      notes: '',
    },
  })

  const getManufacturerOptions = () => {
    switch (deviceType) {
      case 'eld':
        return [
          { value: 'samsara', label: 'Samsara' },
          { value: 'keeptruckin', label: 'KeepTruckin' },
          { value: 'geotab', label: 'Geotab' },
          { value: 'omnitracs', label: 'Omnitracs' },
        ]
      case 'gps':
        return [
          { value: 'garmin', label: 'Garmin' },
          { value: 'tomtom', label: 'TomTom' },
          { value: 'calamp', label: 'CalAmp' },
        ]
      case 'camera':
        return [
          { value: 'lytx', label: 'Lytx' },
          { value: 'samsara', label: 'Samsara' },
          { value: 'motive', label: 'Motive' },
        ]
      default:
        return []
    }
  }

  const getDialogTitle = () => {
    switch (deviceType) {
      case 'eld':
        return t('dialogs.orderEldDevice')
      case 'portable':
        return t('dialogs.orderPortableDevice')
      case 'gps':
        return t('dialogs.orderGpsDevice')
      case 'camera':
        return t('dialogs.orderCameraDevice')
      default:
        return t('actions.order')
    }
  }

  const handleSubmit = async (values: OrderDeviceFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Device ordered:', { deviceType, ...values })

    setOpen(false)
    form.reset()
    onSuccess?.()
  }

  const manufacturerOptions = getManufacturerOptions()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{t('dialogs.orderDeviceDescription')}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={handleSubmit} className="grid gap-4">
          <FormField
            control={form.control}
            name="quantity"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dialogs.quantity')}</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {manufacturerOptions.length > 0 && (
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('columns.manufacturer')}</FormLabel>
                  <Select
                    options={manufacturerOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.model')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('dialogs.modelPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dialogs.notes')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('dialogs.notesPlaceholder')} {...field} />
                </FormControl>
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
              {t('dialogs.submitOrder')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
