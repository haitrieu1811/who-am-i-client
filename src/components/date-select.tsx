/* eslint-disable @typescript-eslint/no-unused-expressions */
import range from 'lodash/range'
import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

type DateSelectProps = {
  onChange?: (date: Date) => void
  value?: Date
}

export default function DateSelect({ onChange, value }: DateSelectProps) {
  const [date, setDate] = React.useState<{
    date: number
    month: number
    year: number
  }>({
    date: 1,
    month: 0,
    year: 1950
  })

  React.useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate() || 1,
        month: value.getMonth() || 0,
        year: value.getFullYear() || 1910
      })
    }
  }, [value])

  const handleChange = (value: string, name: string) => {
    const newDate = {
      ...date,
      [name]: Number(value)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <Select
          defaultValue={date.date.toString()}
          value={date.date.toString()}
          onValueChange={(value) => handleChange(value, 'date')}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Ngày' />
          </SelectTrigger>
          <SelectContent>
            {range(1, 32).map((date) => (
              <SelectItem key={date} value={date.toString()}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='col-span-4'>
        <Select
          defaultValue={date.month.toString()}
          value={date.month.toString()}
          onValueChange={(value) => handleChange(value, 'month')}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Tháng' />
          </SelectTrigger>
          <SelectContent>
            {range(0, 12).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {month + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='col-span-4'>
        <Select
          defaultValue={date.year.toString()}
          value={date.year.toString()}
          onValueChange={(value) => handleChange(value, 'year')}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Năm' />
          </SelectTrigger>
          <SelectContent>
            {range(1950, 2025).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
