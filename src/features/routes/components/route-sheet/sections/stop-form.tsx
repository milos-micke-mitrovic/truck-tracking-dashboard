import { useForm, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { SheetHeader, SheetTitle, Button, IconButton } from '@/shared/ui'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Input, Select, Textarea } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import {
  STOP_TYPE_VALUES,
  ARRIVAL_SLOT_TYPE_VALUES,
  ACCESSORY_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
} from '../../../constants'
import type { RouteStop, StopType, ArrivalSlotType } from '../../../types'
import { mockLocations as MOCK_LOCATIONS } from '@/mocks/data'

type StopFormValues = Omit<RouteStop, 'id'>

type StopFormProps = {
  editingStopIndex: number | null
  initialData?: RouteStop
  onSubmit: (values: StopFormValues) => void
  onCancel: () => void
}

const getStopDefaults = (stop?: RouteStop): StopFormValues => ({
  type: stop?.type || 'pickup',
  locationId: stop?.locationId || '',
  locationName: stop?.locationName || '',
  arrivalSlotType: stop?.arrivalSlotType || 'window',
  startDate: stop?.startDate || '',
  endDate: stop?.endDate || '',
  referenceNumbers: stop?.referenceNumbers || [],
  accessories: stop?.accessories || [],
  requiredDocuments: stop?.requiredDocuments || [],
  instructions: stop?.instructions || '',
})

export function StopForm({
  editingStopIndex,
  initialData,
  onSubmit,
  onCancel,
}: StopFormProps) {
  const { t } = useTranslation('routes')

  const stopForm = useForm<StopFormValues>({
    defaultValues: getStopDefaults(initialData),
  })

  const {
    fields: refNumbers,
    append: appendRef,
    remove: removeRef,
  } = useFieldArray({
    control: stopForm.control,
    name: 'referenceNumbers',
  })

  const stopTypeOptions = STOP_TYPE_VALUES.map((value) => ({
    value,
    label: t(`sheet.stops.types.${value}`),
  }))

  const arrivalSlotTypeOptions = ARRIVAL_SLOT_TYPE_VALUES.map((value) => ({
    value,
    label: t(`sheet.stopSheet.slotTypes.${value}`),
  }))

  const handleSubmit = (values: StopFormValues) => {
    const selectedLocation = MOCK_LOCATIONS.find(
      (l) => l.value === values.locationId
    )
    onSubmit({
      ...values,
      locationName: selectedLocation?.label || '',
    })
  }

  return (
    <Form
      form={stopForm}
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <SheetHeader
        className="border-b px-6 py-3"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
            >
              {t('sheet.stopSheet.cancel')}
            </Button>
            <Button type="submit" size="sm">
              {editingStopIndex !== null
                ? t('sheet.stopSheet.update')
                : t('sheet.stopSheet.create')}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="hover:bg-muted -ml-1 cursor-pointer rounded p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <SheetTitle>
            {editingStopIndex !== null
              ? t('sheet.stopSheet.editTitle')
              : t('sheet.stopSheet.addTitle')}
          </SheetTitle>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={stopForm.control}
            name="type"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('sheet.stopSheet.type')}</FormLabel>
                <Select
                  options={stopTypeOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v as StopType)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={stopForm.control}
            name="locationId"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>
                  {t('sheet.stopSheet.customerLocation')}
                </FormLabel>
                <Select
                  options={MOCK_LOCATIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.stopSheet.selectLocation')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormSection title={t('sheet.stopSheet.arrivalSlot')}>
          <div className="space-y-3">
            <FormField
              control={stopForm.control}
              name="arrivalSlotType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stopSheet.slotType')}</FormLabel>
                  <Select
                    options={arrivalSlotTypeOptions}
                    value={field.value}
                    onChange={(v) => field.onChange(v as ArrivalSlotType)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={stopForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.stopSheet.startDate')}</FormLabel>
                    <FormControl>
                      <input
                        type="datetime-local"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-text rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stopForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.stopSheet.endDate')}</FormLabel>
                    <FormControl>
                      <input
                        type="datetime-local"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-text rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title={t('sheet.stopSheet.referenceNumbers')}>
          <div className="space-y-2">
            {refNumbers.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={stopForm.control}
                  name={`referenceNumbers.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('sheet.stopSheet.refType')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={stopForm.control}
                  name={`referenceNumbers.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('sheet.stopSheet.refValue')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <IconButton
                  icon={<Trash2 className="h-4 w-4" />}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeRef(index)}
                  aria-label={t('sheet.stopSheet.removeRef')}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendRef({ type: '', value: '' })}
              className="w-full"
            >
              <Plus className="mr-1 h-4 w-4" />
              {t('sheet.stopSheet.addRef')}
            </Button>
          </div>
        </FormSection>

        <FormSection title={t('sheet.stopSheet.other')}>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={stopForm.control}
                name="accessories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.stopSheet.accessories')}</FormLabel>
                    <Select
                      options={ACCESSORY_OPTIONS}
                      value={field.value?.[0] || ''}
                      onChange={(v) => field.onChange(v ? [v] : [])}
                      placeholder={t('sheet.stopSheet.selectAccessories')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stopForm.control}
                name="requiredDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('sheet.stopSheet.requiredDocuments')}
                    </FormLabel>
                    <Select
                      options={DOCUMENT_TYPE_OPTIONS}
                      value={field.value?.[0] || ''}
                      onChange={(v) => field.onChange(v ? [v] : [])}
                      placeholder={t('sheet.stopSheet.selectDocuments')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={stopForm.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stopSheet.instructions')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>
      </div>
    </Form>
  )
}
