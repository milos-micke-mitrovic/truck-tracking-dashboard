import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui'
import { AppSidebar } from '@/shared/components'
import { RouteGuard } from './route-guard'

export function DashboardLayout() {
  return (
    <RouteGuard requireAuth={true}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <main className="min-w-0 flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  )
}
