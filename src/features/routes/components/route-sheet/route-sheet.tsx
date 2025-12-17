import { useState, useRef, useCallback } from 'react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
} from '@/shared/ui'
import { Form } from '@/shared/ui/form'
import type { RouteFormValues, RouteSheetProps, RouteStop } from '../../types'
import {
  CarrierSection,
  BrokerSection,
  StopsSection,
  RouteSection,
  LoadSection,
  StopForm,
} from './sections'

const getDefaultValues = (): RouteFormValues => ({
  companyId: '',
  dispatcherId: '',
  tags: [],
  vehicleId: '',
  driverId: '',
  coDriverId: '',
  autoDispatch: false,
  brokerCompanyId: '',
  brokerRepresentativeId: '',
  brokerIdentifier: '',
  internalIdentifier: '',
  brokerRate: '',
  driverRate: '',
  rateConfirmation: null,
  driverRateConfirmation: null,
  stops: [],
  routeId: '',
  emptyMilesCalculated: 0,
  emptyMilesManual: '',
  loadedMilesCalculated: 0,
  loadedMilesManual: '',
  weight: '',
  length: '',
  commodity: '',
  capacity: '',
  temperature: '',
  units: '',
  unitType: '',
})

type View = 'main' | 'stop'

export function RouteSheet({
  open,
  onOpenChange,
  route,
  onSuccess,
}: RouteSheetProps) {
  const { t } = useTranslation('routes')
  const [view, setView] = useState<View>('main')
  const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null)
  const [savedScrollPosition, setSavedScrollPosition] = useState(0)
  const isEdit = !!route

  const mainScrollRef = useRef<HTMLDivElement>(null)

  const form = useForm<RouteFormValues>({
    defaultValues: getDefaultValues(),
  })

  const {
    fields: stops,
    append: appendStop,
    remove: removeStop,
    update: updateStop,
  } = useFieldArray({
    control: form.control,
    name: 'stops',
  })

  // Reset form state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset(getDefaultValues())
      setView('main')
      setEditingStopIndex(null)
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async (values: RouteFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'Route updated:' : 'Route created:', values)
    onOpenChange(false)
    form.reset()
    onSuccess?.()
  }

  const restoreScrollPosition = useCallback(() => {
    requestAnimationFrame(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = savedScrollPosition
      }
    })
  }, [savedScrollPosition])

  const handleAddStop = () => {
    if (mainScrollRef.current) {
      setSavedScrollPosition(mainScrollRef.current.scrollTop)
    }
    setEditingStopIndex(null)
    setView('stop')
  }

  const handleEditStop = (index: number) => {
    if (mainScrollRef.current) {
      setSavedScrollPosition(mainScrollRef.current.scrollTop)
    }
    setEditingStopIndex(index)
    setView('stop')
  }

  const handleStopSubmit = (values: Omit<RouteStop, 'id'>) => {
    const stopData: RouteStop = {
      id:
        editingStopIndex !== null
          ? (stops[editingStopIndex] as RouteStop).id
          : crypto.randomUUID(),
      ...values,
    }

    if (editingStopIndex !== null) {
      updateStop(editingStopIndex, stopData)
    } else {
      appendStop(stopData)
    }
    setView('main')
    setEditingStopIndex(null)
    restoreScrollPosition()
  }

  const handleBackToMain = () => {
    setView('main')
    setEditingStopIndex(null)
    restoreScrollPosition()
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent size="xl" className="flex flex-col overflow-hidden p-0">
        {view === 'main' ? (
          <FormProvider {...form}>
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
                        {t('sheet.cancel')}
                      </Button>
                    </SheetClose>
                    <Button
                      type="submit"
                      size="sm"
                      loading={form.formState.isSubmitting}
                    >
                      {t('sheet.save')}
                    </Button>
                  </>
                }
              >
                <SheetTitle>
                  {isEdit ? t('sheet.editTitle') : t('sheet.addTitle')}
                </SheetTitle>
              </SheetHeader>

              <div
                ref={mainScrollRef}
                className="flex-1 space-y-4 overflow-y-auto px-6 py-4"
              >
                <CarrierSection />
                <BrokerSection />
                <StopsSection
                  stops={stops as RouteStop[]}
                  onAddStop={handleAddStop}
                  onEditStop={handleEditStop}
                  onRemoveStop={removeStop}
                />
                <RouteSection stops={stops as RouteStop[]} />
                <LoadSection />
              </div>
            </Form>
          </FormProvider>
        ) : (
          <StopForm
            editingStopIndex={editingStopIndex}
            initialData={
              editingStopIndex !== null
                ? (stops[editingStopIndex] as RouteStop)
                : undefined
            }
            onSubmit={handleStopSubmit}
            onCancel={handleBackToMain}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
