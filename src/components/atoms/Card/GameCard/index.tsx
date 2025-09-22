'use client'
import { CSSProperties, useState } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { IconUser } from '@/components/atoms/Icons'
import { cn } from '@/lib/utils'

import classes from './GameCard.module.css'
import { GameTag } from './GameTag'
import { LikeButton } from '../../Button/LikeButton'
import { PlayButton } from '../../Button/PlayButton'
import Link from 'next/link'
import { Locale } from '@/i18n-config'

const gameCardVariants = cva('', {
  variants: {
    variant: {
      large: 'rounded-xl md:rounded-2xl',
      big: 'rounded-xl md:rounded-[20px]',
      main: 'rounded-xl md:rounded-2xl',
      provider: 'rounded-lg'
    }
  },
  defaultVariants: {
    variant: 'main'
  }
})

const gameTitleVariants = cva(cn('uppercase text-white text-center font-extrabold', classes.textShadow), {
  variants: {
    title: {
      large: 'leading-none mb-0.5 text-sm tracking-[-0.56px] md:text-[24.391px] md:tracking-[-0.976px]',
      big: 'leading-none mb-0.5 text-sm tracking-[-0.56px] md:text-base md:tracking-[-0.64px]',
      main: 'leading-[88%] md:leading-none mb-0.5 text-[10px] tracking-[-0.4px] md:text-sm md:tracking-[-0.56px]',
      provider: 'leading-[88%] mb-0.5 text-[10px] tracking-[-0.4px]'
    },
    line1: {
      large: 'leading-none mb-0.5 text-sm tracking-[-0.56px] md:text-[24.391px] md:tracking-[-0.976px]',
      big: 'leading-none mb-0.5 text-sm tracking-[-0.56px] md:text-base md:tracking-[-0.64px]',
      main: 'leading-[88%] md:leading-none mb-0.5 text-[10px] tracking-[-0.4px] md:text-sm md:tracking-[-0.56px]',
      provider: 'leading-[88%] mb-0.5 text-[10px] tracking-[-0.4px]'
    },
    line2: {
      large: 'leading-none mb-2 text-2xl tracking-[-1.44px] md:text-[42.684px] md:tracking-[-2.561px]',
      big: 'leading-none mb-2 text-2xl tracking-[-1.44px] md:text-[28px] md:tracking-[-1.68px]',
      main: 'leading-none mb-2 text-base tracking-[-0.96px] md:text-xl md:tracking-[-1.44px]',
      provider: 'leading-none mb-2 text-base tracking-[-0.96px]'
    }
  }
})

const gameProviderVariants = cva(
  cn('mb-2 uppercase text-white text-center leading-none font-semi-bold', classes.textShadow),
  {
    variants: {
      variant: {
        large: 'text-[10px] tracking-[-0.2px] md:text-[18.293px] md:tracking-[-0.366px]',
        big: 'text-[10px] tracking-[-0.2px] md:text-xs md:tracking-[-0.24px]',
        main: 'text-[8px] tracking-[-0.16px] md:text-[10px] md:tracking-[-0.2px]',
        provider: 'text-[6px] tracking-[-0.12px]'
      }
    }
  }
)

const PLAY_BUTTON_SIZE = {
  large: 'lg',
  big: 'md',
  main: 'sm',
  provider: 'sm'
} as const

type GameCardVariant = VariantProps<typeof gameCardVariants>['variant']

export interface GameCardProps {
  id: string
  image: string
  // title: {
  //   line1: string
  //   line2: string
  // }
  title: string
  provider: string
  playersCount?: number
  tag?: 'jackpot' | 'new' | 'new-drop'
  accent?: string
  className?: string
  variant?: GameCardVariant
  isLogin?: boolean // NEW
  onRequireLogin?: () => void
  locale?: Locale
}

export function GameCard({
  id,
  image,
  title,
  provider,
  playersCount = 0,
  tag,
  accent = '#4f2bbc',
  className = '',
  variant = 'main',
  isLogin = false, // default unauth
  onRequireLogin,
  locale
}: GameCardProps) {
  // Debug render
  const variantClass = gameCardVariants({ variant })
  const [liked, setLiked] = useState<boolean>(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLogin) {
      e.preventDefault()
      e.stopPropagation()
      onRequireLogin?.() // open your login modal
      return
    }
    // allow Link to navigate normally
  }

  return (
    <div className={cn(variantClass, 'relative group', className)}>
      <div
        className={cn(
          variantClass,
          ' border border-app-grey12op relative bg-black aspect-[3/4] flex-shrink-0 bg-center bg-cover overflow-hidden'
        )}
        {...(image && {
          style: {
            '--game-card-image-url': `url(${image})`,
            backgroundImage: 'var(--game-card-image-url)'
          } as CSSProperties
        })}
      />
      {/* Content */}
      <div className={cn(variantClass, 'absolute inset-0 flex flex-col justify-end overflow-hidden')}>
        <div
          style={accent ? ({ '--game-card-accent': accent } as CSSProperties) : {}}
          className={cn(
            'text-center text-white px-1 py-3',
            accent && 'bg-gradient-to-b from-transparent via-[var(--game-card-accent)] to-[var(--game-card-accent)]'
          )}
        >
          <div className={gameTitleVariants({ title: variant })}>{title}</div>
          {/* <div className={gameTitleVariants({ line2: variant })}>{line2}</div> */}
          <div className={gameProviderVariants({ variant })}>{provider}</div>

          {variant !== 'provider' && (
            <div>
              <div
                className={cn(
                  'h-5 py-0.5 bg-[#070d1733] rounded-full hover:bg-white/30 text-white border border-app-grey12op text-xs backdrop-blur-[6px] inline-flex items-center justify-between [&>svg]:w-4 [&>svg]:h-4',
                  variant === 'main' && 'text-[10px] [&>svg]:w-3 [&>svg]:h-3 md:text-xs md:[&>svg]:w-4 md:[&>svg]:h-4',
                  playersCount > 0 ? (variant === 'main' ? 'px-[6px]' : 'pl-[7px] pr-1') : 'px-[7px]'
                )}
              >
                {playersCount > 0 ? (
                  <>
                    <span className='w-[6px] h-[6px] bg-ds-accent-green50p mr-1 rounded-full' />
                    <span className={cn('leading-none font-medium', classes.textShadowAlternate)}>{playersCount}</span>
                    <IconUser className='w-4 h-4' />
                  </>
                ) : (
                  'You in?'
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      {tag && (
        <div className='absolute top-[10px] left-0'>
          <GameTag variant={variant} type={tag} />
        </div>
      )}

      <Link
        href={`${locale}/play-game/${id}`}
        onClick={handleClick}
        className={cn(
          variantClass,
          'absolute bottom-0 right-0 hidden group-hover:flex group-hover:items-center group-hover:justify-center w-full h-full transition-all duration-300 ease-in-out opacity-0 bg-game-card-overlay group-hover:opacity-100'
        )}
      >
        <PlayButton size={PLAY_BUTTON_SIZE[variant!]} />
      </Link>
      {/* {variant !== 'provider' && (
        <div className="hidden group-hover:inline-block absolute right-0 top-0">
          <LikeButton liked={liked} onLike={setLiked} />
        </div>
      )} */}
    </div>
  )
}
