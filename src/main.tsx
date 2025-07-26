import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '~/App'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/sonner'
import AppProvider from '~/contexts/app.context'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <AppProvider>
          <App />
          <Toaster richColors position='bottom-center' />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
