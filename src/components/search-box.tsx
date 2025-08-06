/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Loader2, Search, X } from 'lucide-react'
import React from 'react'

import { Input } from '~/components/ui/input'

type SearchBoxProps = {
  isFetching?: boolean
  placeholder?: string
  onChange?: (value: string) => void
}

export default function SearchBox({ isFetching, placeholder, onChange }: SearchBoxProps) {
  const [searchKeyword, setSearchKeyword] = React.useState<string>('')

  const searchBoxRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchKeyword(value)
    onChange && onChange(value)
  }

  const handleClear = () => {
    setSearchKeyword('')
    searchBoxRef.current?.focus()
    onChange && onChange('')
  }

  return (
    <div className='relative'>
      <div className='w-8 absolute left-0 inset-y-0 flex justify-center items-center'>
        <Search className='size-4 stroke-1' />
      </div>
      <Input
        ref={searchBoxRef}
        value={searchKeyword}
        placeholder={placeholder}
        className='px-8'
        onChange={handleChange}
      />
      {isFetching && (
        <div className='w-8 absolute right-0 inset-y-0 flex justify-center items-center'>
          <Loader2 className='size-4 stroke-1 animate-spin' />
        </div>
      )}
      {!isFetching && searchKeyword.trim().length > 0 && (
        <button
          className='w-8 absolute right-0 inset-y-0 flex justify-center items-center hover:cursor-pointer'
          onClick={handleClear}
        >
          <X className='size-4 stroke-1' />
        </button>
      )}
    </div>
  )
}
