import { CircleQuestionMark, FileQuestionMark, Flag, Shirt, Trophy, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar'
import PATH from '~/constants/path'
import { cn } from '~/lib/utils'

// Menu items.
const items = [
  {
    title: 'Quốc gia',
    url: PATH.DASHBOARD_NATIONS,
    icon: Flag
  },
  {
    title: 'Giải đấu',
    url: PATH.DASHBOARD_LEAGUES,
    icon: Trophy
  },
  {
    title: 'Câu lạc bộ',
    url: PATH.DASHBOARD_TEAMS,
    icon: Shirt
  },
  {
    title: 'Cầu thủ',
    url: PATH.DASHBOARD_PLAYERS,
    icon: User
  },
  {
    title: 'Câu hỏi',
    url: PATH.DASHBOARD_QUESTIONS,
    icon: FileQuestionMark
  }
]

export default function AppSidebar() {
  const location = useLocation()
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to={PATH.DASHBOARD}>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <CircleQuestionMark className='size-4' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-medium'>Who Am I</span>
                  <span className='text-muted-foreground'>Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn({
                        'bg-muted pointer-events-none': item.url === location.pathname
                      })}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
