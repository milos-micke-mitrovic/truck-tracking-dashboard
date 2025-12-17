import { useTranslation } from 'react-i18next'
import { H1, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'
import {
  CompaniesTab,
  DriversTab,
  VehiclesTab,
  TrailersTab,
  UsersTab,
} from '../components'

export function AdminPage() {
  const { t } = useTranslation('admin')

  return (
    <div className="flex flex-col gap-6">
      <H1>{t('title')}</H1>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="companies">{t('tabs.companies')}</TabsTrigger>
          <TabsTrigger value="drivers">{t('tabs.drivers')}</TabsTrigger>
          <TabsTrigger value="vehicles">{t('tabs.vehicles')}</TabsTrigger>
          <TabsTrigger value="trailers">{t('tabs.trailers')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4">
          <CompaniesTab />
        </TabsContent>

        <TabsContent value="drivers" className="mt-4">
          <DriversTab />
        </TabsContent>

        <TabsContent value="vehicles" className="mt-4">
          <VehiclesTab />
        </TabsContent>

        <TabsContent value="trailers" className="mt-4">
          <TrailersTab />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
