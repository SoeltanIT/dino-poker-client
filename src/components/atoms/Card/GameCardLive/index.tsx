'use client'

import { useRandomizeCount } from '@/utils/helper/randomNumber'
import { GameCard, GameCardProps } from '../GameCard'

type Props = Omit<GameCardProps, 'playersCount'> & {
  seedIndex: number
  min?: number
  max?: number
}

export default function GameCardLive({ seedIndex, min = 200, max = 700, ...rest }: Props) {
  const players = useRandomizeCount(seedIndex, {
    min,
    max,
    intervalMs: 6000, // ~3.2s base + jitter
    stepMin: 1,
    stepMax: 4
  })
  return <GameCard {...rest} playersCount={players} />
}
