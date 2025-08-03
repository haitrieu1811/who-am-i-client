import { useQuery } from '@tanstack/react-query'
import React from 'react'

import teamsApis, { type GetTeamsReqQuery } from '~/apis/teams.apis'

type UseTeamsProps = GetTeamsReqQuery & {
  enabled?: boolean
}

export default function useTeams({ name, limit = '24', leagueId, page, enabled = true }: UseTeamsProps) {
  const getTeamsQuery = useQuery({
    queryKey: ['get-teams', { name, page, limit, leagueId }],
    queryFn: () =>
      teamsApis.findMany({
        name: name?.trim(),
        page,
        limit,
        leagueId
      }),
    enabled
  })

  const teams = React.useMemo(() => getTeamsQuery.data?.data.data.teams ?? [], [getTeamsQuery.data?.data.data.teams])

  const totalPages = getTeamsQuery.data?.data.data.pagination.totalPages ?? 0

  const totalTeams = getTeamsQuery.data?.data.data.pagination.totalRows ?? 0

  return {
    getTeamsQuery,
    teams,
    totalPages,
    totalTeams
  }
}
