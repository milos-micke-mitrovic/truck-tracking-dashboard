import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'
import {
  EldDevicesTab,
  PortableDevicesTab,
  GpsDevicesTab,
  CameraDevicesTab,
} from './devices'

export function DevicesTab() {
  const { t } = useTranslation('admin')

  return (
    <Tabs defaultValue="eld" className="w-full">
      <TabsList>
        <TabsTrigger value="eld">{t('deviceTabs.eld')}</TabsTrigger>
        <TabsTrigger value="portable">{t('deviceTabs.portable')}</TabsTrigger>
        <TabsTrigger value="gps">{t('deviceTabs.gps')}</TabsTrigger>
        <TabsTrigger value="camera">{t('deviceTabs.camera')}</TabsTrigger>
      </TabsList>
      <TabsContent value="eld">
        <EldDevicesTab />
      </TabsContent>
      <TabsContent value="portable">
        <PortableDevicesTab />
      </TabsContent>
      <TabsContent value="gps">
        <GpsDevicesTab />
      </TabsContent>
      <TabsContent value="camera">
        <CameraDevicesTab />
      </TabsContent>
    </Tabs>
  )
}
