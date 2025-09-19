'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getInitials } from '@/utils/helper/getInitials'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface ProfilePopoverProps {
  children: (props: { onClose: () => void }) => React.ReactNode
}

export default function ProfilePopover({ children }: ProfilePopoverProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className='w-10 h-10 hover:bg-app-bg-button-hover font-semibold rounded-lg flex items-center justify-center cursor-pointer'>
          {session && getInitials(session?.user?.name)}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='bg-app-background-secondary border-app-neutral300 border p-0 w-[250px]'
        align='end'
        side='bottom'
      >
        {children({ onClose: () => setOpen(false) })}
      </PopoverContent>
    </Popover>
  )
}
