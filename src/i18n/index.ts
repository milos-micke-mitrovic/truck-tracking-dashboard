import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEn from './locales/en/common.json'
import navigationEn from './locales/en/navigation.json'
import adminEn from './locales/en/admin.json'
import authEn from './locales/en/auth.json'
import routesEn from './locales/en/routes.json'
import tenantsEn from './locales/en/tenants.json'

export const defaultNS = 'common'

export const resources = {
  en: {
    common: commonEn,
    navigation: navigationEn,
    admin: adminEn,
    auth: authEn,
    routes: routesEn,
    tenants: tenantsEn,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  defaultNS,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
