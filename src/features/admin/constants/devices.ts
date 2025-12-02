// ELD device manufacturers
export const ELD_MANUFACTURER_OPTIONS = [
  { value: 'samsara', label: 'Samsara' },
  { value: 'keeptruckin', label: 'KeepTruckin' },
  { value: 'geotab', label: 'Geotab' },
  { value: 'omnitracs', label: 'Omnitracs' },
] as const

// GPS device manufacturers
export const GPS_MANUFACTURER_OPTIONS = [
  { value: 'garmin', label: 'Garmin' },
  { value: 'tomtom', label: 'TomTom' },
  { value: 'calamp', label: 'CalAmp' },
] as const

// Camera device manufacturers
export const CAMERA_MANUFACTURER_OPTIONS = [
  { value: 'lytx', label: 'Lytx' },
  { value: 'samsara', label: 'Samsara' },
  { value: 'motive', label: 'Motive' },
] as const

// Device type to manufacturer mapping
export const DEVICE_MANUFACTURERS = {
  eld: ELD_MANUFACTURER_OPTIONS,
  gps: GPS_MANUFACTURER_OPTIONS,
  camera: CAMERA_MANUFACTURER_OPTIONS,
  portable: [], // No specific manufacturers
} as const

export type DeviceType = keyof typeof DEVICE_MANUFACTURERS
