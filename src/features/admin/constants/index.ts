// Status
export {
  STATUS_VALUES,
  COMPANY_STATUS_VALUES,
  DRIVER_STATUS_VALUES,
  ENABLED_DISABLED_VALUES,
  ONLINE_STATUS_VALUES,
  type StatusValue,
  type EnabledDisabledValue,
  type OnlineStatusValue,
} from './status'

// Common (shared between company and driver)
export {
  CYCLE_RULE_OPTIONS,
  DEFAULT_CYCLE_RULE,
  CONSTANT_EXCEPTIONS_VALUES,
  DEFAULT_CONSTANT_EXCEPTIONS,
  type ConstantExceptionValue,
} from './common'

// Company
export {
  PLAN_VALUES,
  DEFAULT_PLAN,
  FLEET_OPTIONS,
  FLEET_VALUES,
  INDUSTRY_VALUES,
  DEFAULT_INDUSTRY,
  CARGO_TYPE_VALUES,
  DEFAULT_CARGO_TYPE,
  DEFAULT_VEHICLE_MOTION_SPEED_THRESHOLD,
  WEEK_DAY_VALUES,
  DEFAULT_WEEK_PERIOD_START_DAY,
  SETTLEMENT_TEMPLATE_VALUES,
  DEFAULT_SETTLEMENT_TEMPLATE,
  type PlanValue,
  type FleetValue,
  type IndustryValue,
  type CargoTypeValue,
  type WeekDayValue,
  type SettlementTemplateValue,
} from './company'

// Driver
export {
  COMPENSATION_TYPE_VALUES,
  SCHEDULED_ITEMS_VALUES,
  type CompensationTypeValue,
  type ScheduledItemsValue,
} from './driver'

// User
export {
  USER_STATUS_VALUES,
  ROLE_VALUES,
  type UserStatusValue,
  type RoleValue,
} from './user'

// Vehicle
export {
  VEHICLE_STATUS_VALUES,
  VEHICLE_OWNERSHIP_VALUES,
  FUEL_TYPE_VALUES,
  VEHICLE_MAKE_OPTIONS,
  VEHICLE_MAKE_VALUES,
  type VehicleStatusValue,
  type VehicleOwnershipValue,
  type FuelTypeValue,
  type VehicleMakeValue,
} from './vehicle'

// Trailer
export {
  TRAILER_STATUS_VALUES,
  TRAILER_TYPE_VALUES,
  TRAILER_OWNERSHIP_VALUES,
  type TrailerTypeValue,
  type OwnershipValue,
} from './trailer'

// Timezones
export {
  TIMEZONE_OPTIONS,
  TIMEZONE_VALUES,
  DEFAULT_TIMEZONE,
  DEFAULT_STARTING_TIME,
  type TimezoneValue,
} from './timezones'

// Documents
export {
  COMPANY_DOCUMENT_TYPES,
  DRIVER_DOCUMENT_TYPES,
  VEHICLE_DOCUMENT_TYPES,
  TRAILER_DOCUMENT_TYPES,
  USER_DOCUMENT_TYPES,
} from './documents'

// Location (countries, states)
export {
  COUNTRY_VALUES,
  DEFAULT_COUNTRY,
  US_STATE_OPTIONS,
  US_STATE_VALUES,
  CA_PROVINCE_OPTIONS,
  MX_STATE_OPTIONS,
  getStateOptionsByCountry,
  DRIVER_ATTRIBUTE_OPTIONS,
  DRIVER_ATTRIBUTE_VALUES,
  type CountryValue,
  type DriverAttributeValue,
} from './location'
