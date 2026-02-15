import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
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
  routeKeys,
} from '../api'
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
  brokerRepresentative: '',
  brokerIdentifier: '',
  internalIdentifier: '',
  brokerRate: '',
  driverRate: '',
  stops: [
    {
      type: 'PICKUP',
      facilityId: '',
      arrivalSlotType: '',
      arrivalStartDate: '',
      arrivalEndDate: '',
      referenceNumbers: [],
      accessories: [],
      requiredDocuments: [],
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

function mapRouteToFormValues(route: RouteResponse): RouteFormValues {
  return {
    companyId: route.company?.id ? String(route.company.id) : '',
    dispatcherId: route.dispatcher?.id ? String(route.dispatcher.id) : '',
    vehicleId: route.vehicle?.id ? String(route.vehicle.id) : '',
    driverId: route.driver?.id ? String(route.driver.id) : '',
    coDriverId: route.coDriver?.id ? String(route.coDriver.id) : '',
    autoDispatch: route.autoDispatched,
    brokerId: route.broker?.id ? String(route.broker.id) : '',
    brokerRepresentative: route.brokerRepresentative || '',
    brokerIdentifier: route.brokerIdentifier || '',
    internalIdentifier: route.internalIdentifier || '',
    brokerRate: route.brokerRate != null ? String(route.brokerRate) : '',
    driverRate: route.driverRate != null ? String(route.driverRate) : '',
    stops:
      route.stops?.map((stop) => ({
        type: stop.type,
        facilityId: stop.facility?.id ? String(stop.facility.id) : '',
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
  const stops: StopRequest[] = values.stops.map((stop, index) => ({
    type: stop.type,
    facilityId: stop.facilityId ? parseInt(stop.facilityId) : undefined,
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
  }))

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

  return {
    companyId: parseInt(values.companyId),
    dispatcherId: values.dispatcherId ? parseInt(values.dispatcherId) : undefined,
    vehicleId: values.vehicleId ? parseInt(values.vehicleId) : undefined,
    driverId: values.driverId ? parseInt(values.driverId) : undefined,
    coDriverId: values.coDriverId ? parseInt(values.coDriverId) : undefined,
    autoDispatch: values.autoDispatch,
    brokerId: values.brokerId ? parseInt(values.brokerId) : undefined,
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

  const handleSubmit = async (values: RouteFormValues) => {
    try {
      if (isEdit && routeId) {
        const data = mapFormToUpdateRequest(values)
        await updateMutation.mutateAsync({ id: routeId, data })
        toast.success(t('sheet.editTitle'))
      } else {
        const data = mapFormToCreateRequest(values)
        await createMutation.mutateAsync(data)
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
