import { useQuery } from '@tanstack/react-query'
import React from 'react'

import playersApis, { type GetPlayersReqQuery } from '~/apis/players.apis'

type UsePlayersProps = {
  enabled?: boolean
}

export default function usePlayers({ enabled, ...query }: UsePlayersProps & GetPlayersReqQuery) {
  const getPlayersQuery = useQuery({
    queryKey: ['get-players', query],
    queryFn: () => playersApis.findMany(query),
    enabled
  })

  const players = React.useMemo(
    () => getPlayersQuery.data?.data.data.players ?? [],
    [getPlayersQuery.data?.data.data.players]
  )

  const totalPlayers = getPlayersQuery.data?.data.data.pagination.totalRows ?? 0

  const totalPages = getPlayersQuery.data?.data.data.pagination.totalPages ?? 0

  return {
    getPlayersQuery,
    players,
    totalPlayers,
    totalPages
  }
}
