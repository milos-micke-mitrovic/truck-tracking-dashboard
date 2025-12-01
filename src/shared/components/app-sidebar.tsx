import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Settings } from 'lucide-react'
import { Logo } from './logo'
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
import { useAuth } from '@/features/auth'

export function AppSidebar() {
  const { t } = useTranslation('navigation')
  const { state } = useSidebar()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isCollapsed = state === 'collapsed'

  const handleLogout = () => {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={user?.name}
              className="hover:bg-sidebar-accent"
            >
              <div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Label truncate>{user?.name}</Label>
                  <Caption truncate>{user?.email}</Caption>
                </div>
              )}
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
