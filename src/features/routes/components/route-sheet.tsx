import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Trash2, Upload } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
  Spinner,
  Form,
  ConfirmDialog,
} from '@/shared/ui'
import { getApiErrorMessage } from '@/shared/utils'
import {
  useRoute,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  useParsePdf,
  routeKeys,
} from '../api'
import { brokerKeys } from '@/features/brokers'
import { facilityKeys, type FacilityType } from '@/features/facilities'
import type {
  RouteFormValues,
  RouteResponse,
  RouteCreateRequest,
  RouteUpdateRequest,
  StopRequest,
  LoadDetailsRequest,
  RouteType,
  ArrivalSlotType,
  Capacity,
  WeightUnit,
  UnitType,
  ReferenceNumberType,
  StopType,
  InlineBrokerRequest,
  InlineFacilityRequest,
} from '../types'
import { CarrierTab, BookingTab, StopsTab, RouteDetailsTab, LoadTab } from './tabs'

type RouteSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId?: string | null
}

const getDefaultValues = (): RouteFormValues => ({
  companyId: '',
  dispatcherId: '',
  vehicleId: '',
  driverId: '',
  coDriverId: '',
  autoDispatch: false,
  brokerId: '',
  brokerMcNumber: '',
  brokerRepresentative: '',
  brokerIdentifier: '',
  internalIdentifier: '',
  brokerRate: '',
  driverRate: '',
  stops: [
    {
      type: 'PICKUP',
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
    },
  ],
  totalMiles: '',
  estimatedDuration: '',
  routeHighway: '',
  tolls: '',
  fuelCost: '',
  routeType: '',
  loadDetails: {
    weight: '',
    weightUnit: '',
    lengthFeet: '',
    commodity: '',
    capacity: '',
    temperature: '',
    unitCount: '',
    unitType: '',
  },
})

function isNumericString(value: string): boolean {
  return value.trim() !== '' && !isNaN(Number(value))
}

function mapRouteToFormValues(route: RouteResponse): RouteFormValues {
  return {
    companyId: route.company?.id ? String(route.company.id) : '',
    dispatcherId: route.dispatcher?.id ? String(route.dispatcher.id) : '',
    vehicleId: route.vehicle?.id ? String(route.vehicle.id) : '',
    driverId: route.driver?.id ? String(route.driver.id) : '',
    coDriverId: route.coDriver?.id ? String(route.coDriver.id) : '',
    autoDispatch: route.autoDispatched,
    brokerId: route.broker?.id ? String(route.broker.id) : '',
    brokerMcNumber: '',
    brokerRepresentative: route.brokerRepresentative || '',
    brokerIdentifier: route.brokerIdentifier || '',
    internalIdentifier: route.internalIdentifier || '',
    brokerRate: route.brokerRate != null ? String(route.brokerRate) : '',
    driverRate: route.driverRate != null ? String(route.driverRate) : '',
    stops:
      route.stops?.map((stop) => ({
        type: stop.type,
        facilityId: stop.facility?.id ? String(stop.facility.id) : '',
        facilityType: '',
        facilityAddress: '',
        arrivalSlotType: stop.arrivalSlotType || '',
        arrivalStartDate: stop.arrivalStartDate?.split('T')[0] || '',
        arrivalEndDate: stop.arrivalEndDate?.split('T')[0] || '',
        referenceNumbers:
          stop.referenceNumbers?.map((ref) => ({
            type: ref.type,
            value: ref.value,
          })) || [],
        accessories: stop.accessories || [],
        requiredDocuments: stop.requiredDocuments || [],
        unitCount: stop.unitCount != null ? String(stop.unitCount) : '',
        unitType: stop.unitType || '',
      })) || [],
    totalMiles: route.totalMiles != null ? String(route.totalMiles) : '',
    estimatedDuration: route.estimatedDuration || '',
    routeHighway: route.routeHighway || '',
    tolls: route.tolls != null ? String(route.tolls) : '',
    fuelCost: route.fuelCost != null ? String(route.fuelCost) : '',
    routeType: route.routeType || '',
    loadDetails: {
      weight: route.loadDetails?.weight || '',
      weightUnit: route.loadDetails?.weightUnit || '',
      lengthFeet: route.loadDetails?.lengthFeet || '',
      commodity: route.loadDetails?.commodity || '',
      capacity: route.loadDetails?.capacity || '',
      temperature: route.loadDetails?.temperature || '',
      unitCount:
        route.loadDetails?.unitCount != null
          ? String(route.loadDetails.unitCount)
          : '',
      unitType: route.loadDetails?.unitType || '',
    },
  }
}

function mapFormToCreateRequest(values: RouteFormValues): RouteCreateRequest {
  // Handle stops with inline facility creation
  const stops: StopRequest[] = values.stops.map((stop, index) => {
    let facilityId: number | undefined = undefined
    let newFacility: InlineFacilityRequest | undefined = undefined

    if (stop.facilityId) {
      if (isNumericString(stop.facilityId)) {
        // Existing facility - use ID
        facilityId = parseInt(stop.facilityId)
      } else {
        // New facility - create inline
        if (!stop.facilityType) {
          throw new Error('Facility type is required when creating a new facility')
        }
        newFacility = {
          name: stop.facilityId,
          facilityType: stop.facilityType as FacilityType,
          address: stop.facilityAddress || undefined,
        }
      }
    }

    return {
      type: stop.type,
      facilityId,
      newFacility,
      stopOrder: index,
      arrivalSlotType: (stop.arrivalSlotType as ArrivalSlotType) || undefined,
      arrivalStartDate: stop.arrivalStartDate || undefined,
      arrivalEndDate: stop.arrivalEndDate || undefined,
      referenceNumbers: stop.referenceNumbers
        .filter((ref) => ref.type && ref.value)
        .map((ref) => ({
          type: ref.type as ReferenceNumberType,
          value: ref.value,
        })),
      accessories: stop.accessories.length > 0 ? stop.accessories : undefined,
      requiredDocuments:
        stop.requiredDocuments.length > 0 ? stop.requiredDocuments : undefined,
      unitCount: stop.unitCount ? parseInt(stop.unitCount) : undefined,
      unitType: (stop.unitType as UnitType) || undefined,
    }
  })

  const loadDetails: LoadDetailsRequest = {
    weight: values.loadDetails.weight || undefined,
    weightUnit: (values.loadDetails.weightUnit as WeightUnit) || undefined,
    lengthFeet: values.loadDetails.lengthFeet || undefined,
    commodity: values.loadDetails.commodity || undefined,
    capacity: (values.loadDetails.capacity as Capacity) || undefined,
    temperature: values.loadDetails.temperature || undefined,
    unitCount: values.loadDetails.unitCount
      ? parseInt(values.loadDetails.unitCount)
      : undefined,
    unitType: (values.loadDetails.unitType as UnitType) || undefined,
  }

  // Handle broker - either existing ID or new broker creation
  let brokerId: number | undefined = undefined
  let newBroker: InlineBrokerRequest | undefined = undefined

  if (values.brokerId) {
    if (isNumericString(values.brokerId)) {
      // Existing broker - use ID
      brokerId = parseInt(values.brokerId)
    } else {
      // New broker - create inline
      newBroker = {
        legalName: values.brokerId,
        mcNumber: values.brokerMcNumber || undefined,
      }
    }
  }

  return {
    companyId: parseInt(values.companyId),
    dispatcherId: values.dispatcherId ? parseInt(values.dispatcherId) : undefined,
    vehicleId: values.vehicleId ? parseInt(values.vehicleId) : undefined,
    driverId: values.driverId ? parseInt(values.driverId) : undefined,
    coDriverId: values.coDriverId ? parseInt(values.coDriverId) : undefined,
    autoDispatch: values.autoDispatch,
    brokerId,
    newBroker,
    brokerRepresentative: values.brokerRepresentative || undefined,
    brokerIdentifier: values.brokerIdentifier || undefined,
    internalIdentifier: values.internalIdentifier || undefined,
    brokerRate: values.brokerRate ? parseFloat(values.brokerRate) : undefined,
    driverRate: values.driverRate ? parseFloat(values.driverRate) : undefined,
    stops,
    totalMiles: values.totalMiles ? parseInt(values.totalMiles) : undefined,
    estimatedDuration: values.estimatedDuration || undefined,
    routeHighway: values.routeHighway || undefined,
    tolls: values.tolls ? parseFloat(values.tolls) : undefined,
    fuelCost: values.fuelCost ? parseFloat(values.fuelCost) : undefined,
    routeType: (values.routeType as RouteType) || undefined,
    loadDetails,
  }
}

function mapFormToUpdateRequest(values: RouteFormValues): RouteUpdateRequest {
  return mapFormToCreateRequest(values)
}

export function RouteSheet({ open, onOpenChange, routeId }: RouteSheetProps) {
  const { t } = useTranslation('routes')
  const queryClient = useQueryClient()
  const isEdit = !!routeId

  const { data: route, isLoading: isLoadingRoute } = useRoute(
    routeId || undefined
  )

  const createMutation = useCreateRoute()
  const updateMutation = useUpdateRoute()
  const deleteMutation = useDeleteRoute()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const parsePdfMutation = useParsePdf()
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<RouteFormValues>({
    defaultValues: getDefaultValues(),
  })

  // Reset form when sheet opens or route data loads
  useEffect(() => {
    if (open) {
      if (isEdit && route) {
        form.reset(mapRouteToFormValues(route))
      } else if (!isEdit) {
        form.reset(getDefaultValues())
      }
    }
  }, [open, isEdit, route, form])

  const handleParsePdf = async (file: File) => {
    try {
      const response = await parsePdfMutation.mutateAsync(file)
      const data = response.extraction // Access nested extraction object

      // SKIP CARRIER INFO - must be entered manually
      // Do NOT fill: companyId, dispatcherId, vehicleId, driverId, coDriverId

      // Booking info
      if (data.brokerIdentifier)
        form.setValue('brokerIdentifier', data.brokerIdentifier)
      if (data.brokerRepresentative)
        form.setValue('brokerRepresentative', data.brokerRepresentative)
      if (data.brokerRate != null)
        form.setValue('brokerRate', String(data.brokerRate))

      // Route details
      if (data.totalMiles != null)
        form.setValue('totalMiles', String(data.totalMiles))
      if (data.estimatedDuration)
        form.setValue('estimatedDuration', data.estimatedDuration)
      if (data.routeHighway) form.setValue('routeHighway', data.routeHighway)

      // Load details
      if (data.loadDetails) {
        const ld = data.loadDetails
        if (ld.weight) form.setValue('loadDetails.weight', ld.weight)
        if (ld.weightUnit)
          form.setValue('loadDetails.weightUnit', ld.weightUnit as WeightUnit)
        if (ld.commodity) form.setValue('loadDetails.commodity', ld.commodity)
        if (ld.capacity)
          form.setValue('loadDetails.capacity', ld.capacity as Capacity)
        if (ld.temperature)
          form.setValue('loadDetails.temperature', ld.temperature)
        if (ld.unitCount != null)
          form.setValue('loadDetails.unitCount', String(ld.unitCount))
        if (ld.unitType)
          form.setValue('loadDetails.unitType', ld.unitType as UnitType)
        if (ld.lengthFeet)
          form.setValue('loadDetails.lengthFeet', ld.lengthFeet)
      }

      // Stops - map extracted stops to form format
      if (data.stops && data.stops.length > 0) {
        const mappedStops = data.stops.map((stop) => ({
          type: (stop.type || 'PICKUP') as StopType,
          facilityId: '', // Must be selected manually from facilities dropdown
          facilityType: '' as FacilityType | '',
          facilityAddress: '',
          arrivalSlotType: '' as ArrivalSlotType | '',
          arrivalStartDate: stop.arrivalStartDate || '',
          arrivalEndDate: stop.arrivalEndDate || '',
          referenceNumbers: (stop.referenceNumbers || []).map((ref) => ({
            type: (ref.type || '') as ReferenceNumberType | '',
            value: ref.value || '',
          })),
          accessories: [],
          requiredDocuments: [],
          unitCount: stop.unitCount != null ? String(stop.unitCount) : '',
          unitType: (stop.unitType as UnitType) || '',
        }))
        form.setValue('stops', mappedStops)
      }

      toast.success(t('sheet.pdfParseSuccess'))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('sheet.pdfParseError')))
    }
  }

  const handleSubmit = async (values: RouteFormValues) => {
    try {
      if (isEdit && routeId) {
        const data = mapFormToUpdateRequest(values)
        await updateMutation.mutateAsync({ id: routeId, data })
        toast.success(t('sheet.editTitle'))
      } else {
        const data = mapFormToCreateRequest(values)
        await createMutation.mutateAsync(data)

        // Invalidate queries so new inline-created brokers/facilities appear
        queryClient.invalidateQueries({ queryKey: brokerKeys.all })
        queryClient.invalidateQueries({ queryKey: facilityKeys.all })

        toast.success(t('sheet.addTitle'))
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('sheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!routeId) return
    try {
      queryClient.removeQueries({ queryKey: routeKeys.detail(routeId) })
      await deleteMutation.mutateAsync(routeId)
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="2xl" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingRoute ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('sheet.editTitle')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 items-center justify-center">
              <Spinner size="lg" />
            </div>
          </>
        ) : (
          <Form
            form={form}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <SheetHeader
              className="border-b px-6 py-3"
              actions={
                <>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {t('common:actions.delete')}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      {t('sheet.cancel')}
                    </Button>
                  </SheetClose>
                  <Button type="submit" size="sm" loading={isLoading}>
                    {t('sheet.save')}
                  </Button>
                </>
              }
            >
              <SheetTitle>
                {isEdit ? t('sheet.editTitle') : t('sheet.addTitle')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {/* PDF Upload Section - Only show in create mode */}
              {!isEdit && (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        {t('sheet.parsePdf.title')}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t('sheet.parsePdf.description')}
                      </p>
                    </div>
                    <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Upload className="h-4 w-4" />
                      {parsePdfMutation.isPending
                        ? t('sheet.parsePdf.parsing')
                        : t('sheet.parsePdf.upload')}
                      <input
                        ref={pdfInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleParsePdf(file)
                            e.target.value = '' // Reset to allow re-upload
                          }
                        }}
                        disabled={parsePdfMutation.isPending}
                      />
                    </label>
                  </div>
                </div>
              )}

              <CarrierTab form={form} />
              <BookingTab form={form} />
              <StopsTab form={form} />
              <RouteDetailsTab form={form} />
              <LoadTab form={form} />
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.title')}
          description={t('deleteConfirm.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
