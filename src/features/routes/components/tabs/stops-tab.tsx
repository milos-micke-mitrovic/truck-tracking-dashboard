import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import {
  Button,
  Input,
  Select,
  MultiSelect,
  DatePicker,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Separator,
} from '@/shared/ui'
import { FormSection } from '@/shared/components'
import { useFacilities, FACILITY_TYPE_VALUES } from '@/features/facilities'
import type { RouteFormValues, StopFormValues } from '../../types'
import {
  STOP_TYPE_VALUES,
  ARRIVAL_SLOT_TYPE_VALUES,
  ACCESSORY_TYPE_VALUES,
  REQUIRED_DOCUMENT_TYPE_VALUES,
  REFERENCE_NUMBER_TYPE_VALUES,
  UNIT_TYPE_VALUES,
} from '../../constants'

type StopsTabProps = {
  form: UseFormReturn<RouteFormValues>
}

const getDefaultStop = (order: number): StopFormValues => ({
  type: order === 0 ? 'PICKUP' : 'DELIVERY',
  facilityId: '',
  facilityType: '',
  facilityAddress: '',
  arrivalSlotType: '',
  arrivalStartDate: '',
  arrivalEndDate: '',
  referenceNumbers: [],
  accessories: [],
  requiredDocuments: [],
  unitCount: '',
  unitType: '',
})

export function StopsTab({ form }: StopsTabProps) {
  const { t } = useTranslation('routes')

  const { data: facilitiesData } = useFacilities()

  const {
    fields: stopFields,
    append: appendStop,
    remove: removeStop,
  } = useFieldArray({
    control: form.control,
    name: 'stops',
  })

  const facilityOptions = useMemo(
    () =>
      (facilitiesData || []).map((f) => ({
        value: String(f.id),
        label: `${f.name}${f.city ? ` - ${f.city}` : ''}${f.state ? `, ${f.state}` : ''}`,
      })),
    [facilitiesData]
  )

  const stopTypeOptions = STOP_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.stopTypes.${v}`),
  }))

  const arrivalSlotOptions = ARRIVAL_SLOT_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.arrivalSlots.${v}`),
  }))

  const accessoryOptions = ACCESSORY_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.accessories.${v}`),
  }))

  const requiredDocumentOptions = REQUIRED_DOCUMENT_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.requiredDocuments.${v}`),
  }))

  const referenceTypeOptions = REFERENCE_NUMBER_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.referenceNumbers.${v}`),
  }))

  const unitTypeOptions = UNIT_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.unitTypes.${v}`),
  }))

  const facilityTypeOptions = FACILITY_TYPE_VALUES.map((v) => ({
    value: v,
    label: v.charAt(0) + v.slice(1).toLowerCase(),
  }))

  return (
    <div className="space-y-3">
      {stopFields.map((stopField, stopIndex) => (
        <FormSection
          key={stopField.id}
          title={`${t('sheet.stops.stop')} ${stopIndex + 1}`}
          actions={
            stopFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeStop(stopIndex)}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                {t('sheet.stops.removeStop')}
              </Button>
            )
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.type`}
              rules={{ required: t('validation.required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('sheet.stops.type')}</FormLabel>
                  <Select
                    options={stopTypeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.stops.selectType')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.facilityId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.facility')}</FormLabel>
                  <Select
                    searchable
                    creatable
                    options={facilityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.stops.selectFacility')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.facilityType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.facilityType')}</FormLabel>
                  <Select
                    options={facilityTypeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.stops.selectFacilityType')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.facilityAddress`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.facilityAddress')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('sheet.stops.facilityAddressPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.arrivalSlotType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.arrivalSlotType')}</FormLabel>
                  <Select
                    options={arrivalSlotOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.stops.selectArrivalSlot')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.arrivalStartDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.arrivalStartDate')}</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.arrivalEndDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.arrivalEndDate')}</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.unitCount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.unitCount')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder={t('sheet.stops.unitCountPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`stops.${stopIndex}.unitType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.stops.unitType')}</FormLabel>
                  <Select
                    options={unitTypeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.stops.selectUnitType')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Accessories */}
          <FormField
            control={form.control}
            name={`stops.${stopIndex}.accessories`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.stops.accessories')}</FormLabel>
                <MultiSelect
                  options={accessoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Required Documents */}
          <FormField
            control={form.control}
            name={`stops.${stopIndex}.requiredDocuments`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.stops.requiredDocuments')}</FormLabel>
                <MultiSelect
                  options={requiredDocumentOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Numbers */}
          <Separator />
          <ReferenceNumbersSection
            form={form}
            stopIndex={stopIndex}
            referenceTypeOptions={referenceTypeOptions}
            t={t}
          />
        </FormSection>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendStop(getDefaultStop(stopFields.length))}
        className="w-full"
      >
        <Plus className="mr-1 h-4 w-4" />
        {t('sheet.stops.addStop')}
      </Button>
    </div>
  )
}

type ReferenceNumbersSectionProps = {
  form: UseFormReturn<RouteFormValues>
  stopIndex: number
  referenceTypeOptions: { value: string; label: string }[]
  t: (key: string) => string
}

function ReferenceNumbersSection({
  form,
  stopIndex,
  referenceTypeOptions,
  t,
}: ReferenceNumbersSectionProps) {
  const {
    fields: refFields,
    append: appendRef,
    remove: removeRef,
  } = useFieldArray({
    control: form.control,
    name: `stops.${stopIndex}.referenceNumbers`,
  })

  return (
    <div className="space-y-2">
      <FormLabel>{t('sheet.stops.referenceNumbers')}</FormLabel>
      {refFields.map((refField, refIndex) => (
        <div key={refField.id} className="flex items-end gap-2">
          <FormField
            control={form.control}
            name={`stops.${stopIndex}.referenceNumbers.${refIndex}.type`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  options={referenceTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.stops.selectReferenceType')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`stops.${stopIndex}.referenceNumbers.${refIndex}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('sheet.stops.referenceValue')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive hover:text-destructive"
            onClick={() => removeRef(refIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => appendRef({ type: '', value: '' })}
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        {t('sheet.stops.addReference')}
      </Button>
    </div>
  )
}
