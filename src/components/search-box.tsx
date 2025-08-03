import { Loader2, Search, X } from 'lucide-react'
import React from 'react'

import { Input } from '~/components/ui/input'

type SearchBoxProps = {
  isFetching?: boolean
  value: string
  placeholder?: string
  setValue: (value: React.SetStateAction<string>) => void
}

export default function SearchBox({ isFetching, value, placeholder, setValue }: SearchBoxProps) {
  const searchBoxRef = React.useRef<HTMLInputElement>(null)

  const handleClearSearchValue = () => {
    setValue('')
    searchBoxRef.current?.focus()
  }

  return (
    <div className='relative'>
      <div className='w-8 absolute left-0 inset-y-0 flex justify-center items-center'>
        <Search className='size-4 stroke-1' />
      </div>
      <Input
        ref={searchBoxRef}
        value={value}
        placeholder={placeholder}
        className='px-8'
        onChange={(e) => setValue(e.target.value)}
      />
      {isFetching && (
        <div className='w-8 absolute right-0 inset-y-0 flex justify-center items-center'>
          <Loader2 className='size-4 stroke-1 animate-spin' />
        </div>
      )}
      {!isFetching && value.trim().length > 0 && (
        <button
          className='w-8 absolute right-0 inset-y-0 flex justify-center items-center hover:cursor-pointer'
          onClick={handleClearSearchValue}
        >
          <X className='size-4 stroke-1' />
        </button>
      )}
    </div>
  )
}
