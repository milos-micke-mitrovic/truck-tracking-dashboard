// Countries
export const COUNTRY_VALUES = ['us', 'ca', 'mx'] as const
export type CountryValue = (typeof COUNTRY_VALUES)[number]

export const DEFAULT_COUNTRY: CountryValue = 'us'

// US States
export const US_STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const

export const US_STATE_VALUES = US_STATE_OPTIONS.map((s) => s.value)

// Canadian Provinces
export const CA_PROVINCE_OPTIONS = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'YT', label: 'Yukon' },
] as const

// Mexican States
export const MX_STATE_OPTIONS = [
  { value: 'AGU', label: 'Aguascalientes' },
  { value: 'BCN', label: 'Baja California' },
  { value: 'BCS', label: 'Baja California Sur' },
  { value: 'CAM', label: 'Campeche' },
  { value: 'CHP', label: 'Chiapas' },
  { value: 'CHH', label: 'Chihuahua' },
  { value: 'COA', label: 'Coahuila' },
  { value: 'COL', label: 'Colima' },
  { value: 'CMX', label: 'Ciudad de México' },
  { value: 'DUR', label: 'Durango' },
  { value: 'GUA', label: 'Guanajuato' },
  { value: 'GRO', label: 'Guerrero' },
  { value: 'HID', label: 'Hidalgo' },
  { value: 'JAL', label: 'Jalisco' },
  { value: 'MEX', label: 'México' },
  { value: 'MIC', label: 'Michoacán' },
  { value: 'MOR', label: 'Morelos' },
  { value: 'NAY', label: 'Nayarit' },
  { value: 'NLE', label: 'Nuevo León' },
  { value: 'OAX', label: 'Oaxaca' },
  { value: 'PUE', label: 'Puebla' },
  { value: 'QUE', label: 'Querétaro' },
  { value: 'ROO', label: 'Quintana Roo' },
  { value: 'SLP', label: 'San Luis Potosí' },
  { value: 'SIN', label: 'Sinaloa' },
  { value: 'SON', label: 'Sonora' },
  { value: 'TAB', label: 'Tabasco' },
  { value: 'TAM', label: 'Tamaulipas' },
  { value: 'TLA', label: 'Tlaxcala' },
  { value: 'VER', label: 'Veracruz' },
  { value: 'YUC', label: 'Yucatán' },
  { value: 'ZAC', label: 'Zacatecas' },
] as const

// Get state options by country
export function getStateOptionsByCountry(country: string) {
  switch (country) {
    case 'us':
      return [...US_STATE_OPTIONS]
    case 'ca':
      return [...CA_PROVINCE_OPTIONS]
    case 'mx':
      return [...MX_STATE_OPTIONS]
    default:
      return [...US_STATE_OPTIONS]
  }
}

// Driver attribute options (for the dropdown)
export const DRIVER_ATTRIBUTE_OPTIONS = [
  { value: 'team', label: 'Team' },
  { value: 'division', label: 'Division' },
  { value: 'region', label: 'Region' },
  { value: 'fleet', label: 'Fleet' },
  { value: 'custom', label: 'Custom' },
] as const

export const DRIVER_ATTRIBUTE_VALUES = DRIVER_ATTRIBUTE_OPTIONS.map(
  (a) => a.value
)
export type DriverAttributeValue = (typeof DRIVER_ATTRIBUTE_VALUES)[number]
