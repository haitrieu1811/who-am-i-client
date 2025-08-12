/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Loader2 } from 'lucide-react'
import React from 'react'

import PlayerItem from '~/components/player-item'
import SearchBox from '~/components/search-box'
import useDebounce from '~/hooks/use-debounce'
import usePlayers from '~/hooks/use-players'
import type { PlayerItem as PlayerItemType } from '~/types/players.types'

type SelectPlayerProps = {
  defaultValue?: PlayerItemType | null
  isPlayMode?: boolean
  onChange?: (playerData: PlayerItemType) => void
}

export default React.memo(function SelectPlayer({ defaultValue, isPlayMode = false, onChange }: SelectPlayerProps) {
  const [searchKeyword, setSearchKeyword] = React.useState<string>('')
  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerItemType | null>(null)

  const debounceSearchKeyword = useDebounce(searchKeyword, 1000)

  const { players, totalPlayers, getPlayersQuery } = usePlayers({
    name: debounceSearchKeyword.trim() ? debounceSearchKeyword : undefined,
    enabled: !!debounceSearchKeyword.trim()
  })

  React.useEffect(() => {
    if (!currentPlayer) return
    onChange && onChange(currentPlayer)
  }, [currentPlayer, onChange])

  return (
    <div className='space-y-4'>
      <SearchBox placeholder='Tìm kiếm cầu thủ...' onChange={(value) => setSearchKeyword(value)} />
      {/* Danh sách cầu thủ */}
      {totalPlayers > 0 && !getPlayersQuery.isPending && (
        <div className='grid grid-cols-12 gap-4'>
          {players.map((player) => (
            <div key={player._id} className='col-span-4'>
              <PlayerItem
                playerData={player}
                isSelectMode
                isPlayMode={isPlayMode}
                isActive={player._id === currentPlayer?._id || player._id === defaultValue?._id}
                onClick={(playerData) => setCurrentPlayer(playerData)}
              />
            </div>
          ))}
        </div>
      )}
      {/* Loading */}
      {getPlayersQuery.isFetching && (
        <div className='flex justify-center items-center p-10'>
          <Loader2 className='size-10 animate-spin stroke-1' />
        </div>
      )}
      {/* Không tìm thấy cầu thủ */}
      {totalPlayers === 0 && !getPlayersQuery.isPending && (
        <div className='flex flex-col justify-center items-center space-y-2 p-6 pb-0 text-center text-sm'>
          <h3 className='font-semibold'>Không tìm thấy cầu thủ</h3>
          <p className='text-muted-foreground'>Không có cầu thủ nào trùng khớp với từ khóa "{debounceSearchKeyword}"</p>
        </div>
      )}
    </div>
  )
})
