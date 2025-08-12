/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cn } from '~/lib/utils'

type SelectItemProps = {
  logo: string
  name: string
  isActive?: boolean
  onClick?: () => void
}

export default function SelectItem({ name, logo, isActive, onClick }: SelectItemProps) {
  const handleClick = () => {
    onClick && onClick()
  }

  return (
    <div
      className={cn('p-4 border-2 rounded-md flex flex-col justify-center items-center space-y-4 bg-secondary', {
        'hover:cursor-pointer': !isActive,
        'border-primary pointer-events-none': isActive
      })}
      onClick={handleClick}
    >
      <img src={logo} alt={name} className='size-8' />
      <div className='text-sm font-medium text-center'>{name}</div>
    </div>
  )
}
