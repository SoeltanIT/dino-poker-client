import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { PlayIcon } from '../../Icons/PlayIcon'

const playButtonVariants = cva(
  'inline-flex items-center justify-center bg-transparent border-none rounded-full bg-play-button shadow-play-button',
  {
    variants: {
      size: {
        lg: 'h-14 w-14 p-3 [&>svg]:w-8 [&>svg]:h-8 md:h-[88px] md:w-[88px] md:p-[18.86px] md:[&>svg]:w-[50.286px]',
        md: 'h-14 w-14 p-3 [&>svg]:w-8 [&>svg]:h-8 md:h-[72px] md:w-[72px] md:p-[15.43px] md:[&>svg]:w-[41.143px]',
        sm: 'h-14 w-14 p-3 [&>svg]:w-8 [&>svg]:h-8',
        xs: 'h-8 w-8 p-[6.86px] [&>svg]:w-[18.286px] [&>svg]:h-[18.286px]'
      }
    },
    defaultVariants: {
      size: 'lg'
    }
  }
)

interface PlayButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof playButtonVariants> {
  asChild?: boolean
}

const PlayButton = React.forwardRef<HTMLButtonElement, PlayButtonProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp ref={ref} className={cn(playButtonVariants({ size, className }))} {...props}>
        <PlayIcon />
      </Comp>
    )
  }
)

PlayButton.displayName = 'PlayButton'

export { PlayButton, playButtonVariants, type PlayButtonProps }
