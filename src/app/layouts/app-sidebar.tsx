import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Settings, Route, Building2, FileText } from 'lucide-react'
import { Logo } from '@/shared/components'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/shared/ui/sidebar'
import { H4, Label, Caption, BodySmall } from '@/shared/ui/typography'
import {
  useAuth,
  useLogout,
  getUserDisplayName,
  getUserInitials,
  isSuperAdmin,
} from '@/features/auth'
import { usePodNotifications } from '@/features/routes/context/pod-notification-context'

export function AppSidebar() {
  const { t } = useTranslation('navigation')
  const { state } = useSidebar()
  const { user, logout } = useAuth()
  const logoutMutation = useLogout()
  const navigate = useNavigate()
  const { totalUnread } = usePodNotifications()
  const { pathname } = useLocation()
  const isCollapsed = state === 'collapsed'

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // Continue with local logout even if API call fails
    }
    logout()
    navigate('/login')
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center border-b px-4">
        <div className="flex items-center gap-2">
          <Logo size="sm" className="shrink-0" />
          {!isCollapsed && <H4>{t('common:app.name')}</H4>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isSuperAdmin(user) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/tenants')} tooltip={t('sidebar.tenants')}>
                    <NavLink to="/tenants">
                      <Building2 className="size-4" />
                      <BodySmall as="span">{t('sidebar.tenants')}</BodySmall>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {!isSuperAdmin(user) && user?.role === 'ADMIN' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/admin')} tooltip={t('sidebar.admin')}>
                    <NavLink to="/admin">
                      <Settings className="size-4" />
                      <BodySmall as="span">{t('sidebar.admin')}</BodySmall>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {!isSuperAdmin(user) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/routes')} tooltip={t('sidebar.dispatch')}>
                    <NavLink to="/routes" className="relative">
                      <div className="relative">
                        <Route className="size-4" />
                        {totalUnread > 0 && isCollapsed && (
                          <span
                            className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[8px] font-medium text-destructive-foreground"
                            aria-label={t('common:notifications.unreadCount', { count: totalUnread })}
                          >
                            {totalUnread > 9 ? '9+' : totalUnread}
                          </span>
                        )}
                      </div>
                      <BodySmall as="span">{t('sidebar.dispatch')}</BodySmall>
                      {totalUnread > 0 && !isCollapsed && (
                        <span
                          className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
                          aria-label={t('common:notifications.unreadCount', { count: totalUnread })}
                        >
                          {totalUnread > 99 ? '99+' : totalUnread}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!isSuperAdmin(user) && (
          <SidebarGroup className="mt-auto pb-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/company-docs')} tooltip={t('sidebar.companyDocs')}>
                    <NavLink to="/company-docs">
                      <FileText className="size-4" />
                      <BodySmall as="span">{t('sidebar.companyDocs')}</BodySmall>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={user ? getUserDisplayName(user) : undefined}
              className="hover:bg-sidebar-accent"
            >
              <div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {user ? getUserInitials(user) : '?'}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <Label truncate>{user ? getUserDisplayName(user) : ''}</Label>
                <Caption truncate>{user?.email}</Caption>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t('auth:logout')}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <BodySmall as="span">{t('auth:logout')}</BodySmall>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
