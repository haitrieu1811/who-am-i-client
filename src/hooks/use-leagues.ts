import { useQuery } from '@tanstack/react-query'
import React from 'react'

import leaguesApis from '~/apis/leagues.apis'

export default function useLeagues() {
  const getLeaguesQuery = useQuery({
    queryKey: ['get-leagues'],
    queryFn: () => leaguesApis.findMany()
  })

  const leagues = React.useMemo(
    () => getLeaguesQuery.data?.data.data.leagues ?? [],
    [getLeaguesQuery.data?.data.data.leagues]
  )

  return {
    getLeaguesQuery,
    leagues
  }
}
