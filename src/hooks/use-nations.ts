import { useQuery } from '@tanstack/react-query'
import React from 'react'

import nationsApis, { type GetNationsReqQuery } from '~/apis/nations.apis'

type UseNationsProps = GetNationsReqQuery & {
  enabled?: boolean
}

export default function useNations({ enabled = true, ...query }: UseNationsProps) {
  const getNationsQuery = useQuery({
    queryKey: ['get-nations', query],
    queryFn: () => nationsApis.findMany(query),
    enabled
  })

  const nations = React.useMemo(
    () => getNationsQuery.data?.data.data.nations ?? [],
    [getNationsQuery.data?.data.data.nations]
  )

  const totalNations = getNationsQuery.data?.data.data.pagination.totalRows ?? 0

  const pagination = React.useMemo(
    () => getNationsQuery.data?.data.data.pagination,
    [getNationsQuery.data?.data.data.pagination]
  )

  return {
    getNationsQuery,
    nations,
    totalNations,
    pagination
  }
}
