import React from 'react'

import AppSidebar from '~/components/app-sidebar'
import { ModeToggle } from '~/components/mode-toggle'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full p-4'>
        <div className='flex justify-between items-center'>
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <div className='pt-4'>{children}</div>
      </main>
    </SidebarProvider>
  )
}
