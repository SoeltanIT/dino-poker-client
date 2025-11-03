'use client'
import { CSSProperties, useState } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { IconUser } from '@/components/atoms/Icons'
import { cn } from '@/lib/utils'

import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import Image from 'next/image'
import { PlayButton } from '../../Button/PlayButton'
import classes from './GameCard.module.css'
import { GameTag } from './GameTag'

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
      main: 'leading-[88%] md:leading-none mb-0.5 text-[12px] tracking-[-0.4px] md:text-base md:tracking-[-0.56px]',
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
  onClickOpenGames?: (id: string) => void
  locale?: Locale
  isOpening?: boolean
  lang?: LangProps
  priority?: boolean
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
  onClickOpenGames,
  locale,
  isOpening = false,
  lang,
  priority = false
}: GameCardProps) {
  // Debug render
  const [loaded, setLoaded] = useState(false)
  const variantClass = gameCardVariants({ variant })
  const [liked, setLiked] = useState<boolean>(false)

  const handleClick = () => {
    if (!isLogin) onRequireLogin?.()
    else onClickOpenGames?.(id)
  }

  const SIZES = '(max-width: 768px) 33vw, 16vw' // grid: 3 cols mobile, 6 cols desktop

  return (
    <div className={cn(variantClass, 'relative group', className)}>
      {/* IMAGE FRAME (keeps aspect 3/4 and rounded border) */}
      <div className={cn('relative aspect-[3/4] overflow-hidden border border-app-grey12op rounded-xl md:rounded-2xl')}>
        <Image
          src={image}
          alt={title}
          fill
          sizes={SIZES}
          // If you have a tiny preview, pass it:
          // placeholder="blur"
          // blurDataURL={props.preview}
          priority={priority} // set true for first ~4–6 cards above the fold
          onLoad={() => setLoaded(true)}
          className={cn(
            'object-cover transition-[transform,filter,opacity] duration-500 ease-out',
            'group-hover:scale-[1.06] group-hover:brightness-110',
            loaded ? 'opacity-100' : 'opacity-90 blur-[6px]' // blur-up fallback if you don’t have blurDataURL
          )}
        />
      </div>

      {/* Content */}
      {/* <div className={cn(variantClass, 'absolute inset-0 z-10 flex flex-col justify-end overflow-hidden')}>
        <div
          style={accent ? ({ '--game-card-accent': accent } as CSSProperties) : {}}
          className={cn(
            'text-center text-white px-1 py-3'
            // accent && 'bg-gradient-to-b from-transparent via-[var(--game-card-accent)] to-[var(--game-card-accent)]'
          )}
        >
          <div className={gameTitleVariants({ title: variant })}>
            {lang?.game?.[title.toLowerCase().replace(/\s+/g, '')] ?? title}
          </div>
          <div className={gameProviderVariants({ variant })}>{provider}</div>
        </div>
      </div> */}

      {/* Badges */}
      {tag && (
        <div className='absolute top-[10px] left-0 z-20'>
          <GameTag variant={variant} type={tag} />
        </div>
      )}

      <div className='absolute top-[6px] right-[10px] z-10'>
        {variant !== 'provider' && (
          <div
            className={cn(
              'h-5 py-0.5 bg-[#070d1733] rounded-full hover:bg-white/30 text-white border border-app-grey12op text-xs backdrop-blur-[6px] inline-flex items-center justify-between [&>svg]:w-4 [&>svg]:h-4',
              variant === 'main' && 'text-[10px] [&&>svg]:w-3 [&&>svg]:h-3 md:text-xs md:[&&>svg]:w-4 md:[&&>svg]:h-4',
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
        )}
      </div>

      <div
        onClick={isOpening ? undefined : handleClick}
        className={cn(
          variantClass,
          'absolute inset-0 z-20 hidden opacity-0 transition-opacity duration-300 ease-in-out',
          'group-hover:flex group-hover:items-center group-hover:justify-center group-hover:opacity-100',
          'bg-game-card-overlay',
          isOpening && 'cursor-wait'
        )}
      >
        <PlayButton size={PLAY_BUTTON_SIZE[variant!]} />
      </div>

      {isOpening && (
        <div className='absolute inset-0 z-30 grid place-items-center bg-black/50 backdrop-blur-sm'>
          <div className='text-white text-xs md:text-sm'>{lang?.common?.opening}…</div>
        </div>
      )}
    </div>
  )
}
