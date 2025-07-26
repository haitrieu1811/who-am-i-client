import { CircleQuestionMark, FileQuestionMark, Flag, Shirt, Trophy, User } from 'lucide-react'
import { Link } from 'react-router-dom'

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

// Menu items.
const items = [
  {
    title: 'Quốc gia',
    url: '#',
    icon: Flag
  },
  {
    title: 'Giải đấu',
    url: '#',
    icon: Trophy
  },
  {
    title: 'Câu lạc bộ',
    url: '#',
    icon: Shirt
  },
  {
    title: 'Cầu thủ',
    url: '#',
    icon: User
  },
  {
    title: 'Câu hỏi',
    url: '#',
    icon: FileQuestionMark
  }
]

export default function AppSidebar() {
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
