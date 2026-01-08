import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Settings, Route } from 'lucide-react'
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
import { cn } from '@/shared/utils'
import {
  useAuth,
  useLogout,
  getUserDisplayName,
  getUserInitials,
} from '@/features/auth'

export function AppSidebar() {
  const { t } = useTranslation('navigation')
  const { state } = useSidebar()
  const { user, logout } = useAuth()
  const logoutMutation = useLogout()
  const navigate = useNavigate()
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('sidebar.admin')}>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      cn(isActive && 'bg-sidebar-accent')
                    }
                  >
                    <Settings className="size-4" />
                    <BodySmall as="span">{t('sidebar.admin')}</BodySmall>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('sidebar.routes')}>
                  <NavLink
                    to="/routes"
                    className={({ isActive }) =>
                      cn(isActive && 'bg-sidebar-accent')
                    }
                  >
                    <Route className="size-4" />
                    <BodySmall as="span">{t('sidebar.routes')}</BodySmall>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
