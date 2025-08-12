import React from 'react'

import { getAccessTokenFromStorage, getUserFromStorage } from '~/lib/auth'
import type { LeagueItem } from '~/types/leagues.types'
import type { TeamItem } from '~/types/teams.types'
import type { OriginalUser } from '~/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: OriginalUser | null
  setUser: React.Dispatch<React.SetStateAction<OriginalUser | null>>

  currentLeague: LeagueItem | null
  setCurrentLeague: React.Dispatch<React.SetStateAction<LeagueItem | null>>
  currentTeam: TeamItem | null
  setCurrentTeam: React.Dispatch<React.SetStateAction<TeamItem | null>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  handleResetSelectPlayer: () => void
}

const defaultAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromStorage(),
  setIsAuthenticated: () => null,
  user: getUserFromStorage(),
  setUser: () => null,

  currentLeague: null,
  setCurrentLeague: () => null,
  currentTeam: null,
  setCurrentTeam: () => null,
  page: 1,
  setPage: () => null,
  handleResetSelectPlayer: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = React.createContext<AppContext>(defaultAppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // Authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(defaultAppContext.isAuthenticated)
  const [user, setUser] = React.useState<OriginalUser | null>(defaultAppContext.user)

  // Chọn giải đấu, CLB
  const [currentLeague, setCurrentLeague] = React.useState<LeagueItem | null>(null)
  const [currentTeam, setCurrentTeam] = React.useState<TeamItem | null>(null)
  const [page, setPage] = React.useState<number>(1)

  const handleResetSelectPlayer = () => {
    setCurrentLeague(null)
    setCurrentTeam(null)
    setPage(1)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        currentLeague,
        setCurrentLeague,
        currentTeam,
        setCurrentTeam,
        page,
        setPage,
        handleResetSelectPlayer
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
