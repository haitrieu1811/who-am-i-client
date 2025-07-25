import React from 'react'

import { getAccessTokenFromStorage, getUserFromStorage } from '~/lib/auth'
import type { OriginalUser } from '~/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: OriginalUser | null
  setUser: React.Dispatch<React.SetStateAction<OriginalUser | null>>
}

const defaultAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromStorage(),
  setIsAuthenticated: () => null,
  user: getUserFromStorage(),
  setUser: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = React.createContext<AppContext>(defaultAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(defaultAppContext.isAuthenticated)
  const [user, setUser] = React.useState<OriginalUser | null>(defaultAppContext.user)

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>{children}</AppContext.Provider>
  )
}
