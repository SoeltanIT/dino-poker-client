'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ReactNode, useState, isValidElement } from 'react'

interface GlobalSheetProps {
  trigger: ReactNode
  children: ReactNode | ((props: { onClose: () => void }) => ReactNode)
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function GlobalSheet({
  trigger,
  children,
  side = 'bottom',
  className = '',
  open,
  onOpenChange
}: GlobalSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = typeof open !== 'undefined' && typeof onOpenChange === 'function'
  const sheetOpen = isControlled ? open : internalOpen
  const sheetChange = isControlled ? onOpenChange! : setInternalOpen

  const handleClose = () => sheetChange(false)

  const renderedChildren = typeof children === 'function' ? children({ onClose: handleClose }) : children

  return (
    <Sheet open={sheetOpen} onOpenChange={sheetChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className={`rounded-t-xl bg-app-background-secondary border border-app-neutral300 pb-6 !px-0 ${className}`}
      >
        {renderedChildren}
      </SheetContent>
    </Sheet>
  )
}
