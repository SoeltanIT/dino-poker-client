'use client'
import { ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

// export const metadata: Metadata = {
//   title: 'User Guide Page',
//   description: 'User Guide Page'
// }

const GAMES = [
  {
    label: 'Texas Poker',
    value: 'texas-poker'
  },
  {
    label: 'Omaha',
    value: 'omaha'
  },
  {
    label: 'Tournament',
    value: 'tournament'
  },
  {
    label: 'Super Ten',
    value: 'super-ten'
  },
  {
    label: 'Domino',
    value: 'domino'
  },
  {
    label: 'Ceme Keliling',
    value: 'ceme-keliling'
  },
  {
    label: 'Ceme',
    value: 'ceme'
  },
  {
    label: 'Capsa',
    value: 'capsa'
  },
  {
    label: 'QQ Spirit',
    value: 'qq-spirit'
  },
  {
    label: 'Super Bull',
    value: 'super-bull'
  },
  {
    label: 'Capsa Susun',
    value: 'capsa-susun'
  },
  {
    label: 'Domino Dealer',
    value: 'domino-dealer'
  },
  {
    label: 'Joker Spin',
    value: 'joker-spin'
  }
]

const TABS = [
  {
    label: 'Poker',
    value: 'poker'
  },
  {
    label: 'Sports',
    value: 'sports'
  }
]

export default function Layout({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(TABS[0].value)
  const [activeGame, setActiveGame] = useState(GAMES[0].value)
  return (
    <div className='min-h-screen flex flex-col w-full md:w-[870px] text-app-text-color px-6 lg:px-16 my-10 mx-auto'>
      <div className='container mx-auto flex flex-col'>
        <div className='w-full mb-6'>
          <div className='flex gap-2 mb-4'>
            {TABS.map(tab => (
              <Button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'h-10 px-6 uppercase',
                  activeTab === tab.value && 'bg-app-primary text-white hover:bg-app-primary-hover'
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          {activeTab === 'poker' && (
            <Select value={activeGame} onValueChange={setActiveGame}>
              <SelectTrigger className='bg-app-white100 text-app-text-color'>
                <SelectValue placeholder='Select game' />
              </SelectTrigger>
              <SelectContent className='bg-app-background-primary'>
                {GAMES.map((game, index) => (
                  <SelectItem key={index} value={game.value} className='text-app-text-color'>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
