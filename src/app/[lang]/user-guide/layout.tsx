'use client'
import { PropsWithChildren, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'

const GAMES_DICTIONARY: Record<string, Array<{ label: string; value: string }>> = {
  en: [
    { label: 'Texas Poker', value: 'texas-poker' },
    { label: 'Omaha', value: 'omaha' },
    { label: 'Tournament', value: 'tournament' },
    { label: 'Super Ten', value: 'super-ten' },
    { label: 'Domino', value: 'domino' },
    { label: 'Ceme Keliling', value: 'ceme-keliling' },
    { label: 'Ceme', value: 'ceme' },
    { label: 'Capsa', value: 'capsa' },
    { label: 'QQ Spirit', value: 'qq-spirit' },
    { label: 'Super Bull', value: 'super-bull' },
    { label: 'Capsa Susun', value: 'capsa-susun' },
    { label: 'Domino Dealer', value: 'domino-dealer' },
    { label: 'Joker Spin', value: 'joker-spin' }
  ],
  ko: [
    { label: '텍사스 포커', value: 'texas-poker' },
    { label: '오마하', value: 'omaha' },
    { label: '토너먼트', value: 'tournament' },
    { label: '슈퍼 텐', value: 'super-ten' },
    { label: '도미노', value: 'domino' },
    { label: '체메 켈릴링', value: 'ceme-keliling' },
    { label: '체메', value: 'ceme' },
    { label: '빅투 (캅사)', value: 'capsa' },
    { label: 'QQ 스피릿', value: 'qq-spirit' },
    { label: '슈퍼 불', value: 'super-bull' },
    { label: '캅사 수순', value: 'capsa-susun' },
    { label: '도미노 딜러', value: 'domino-dealer' },
    { label: '조커 스핀', value: 'joker-spin' }
  ]
}

const TABS: Record<string, Array<{ label: string; value: string }>> = {
  en: [
    { label: 'Poker', value: 'poker' },
    { label: 'Sports', value: 'sports' }
  ],
  ko: [
    { label: '포커', value: 'poker' },
    { label: '스포츠', value: 'sports' }
  ]
}

export default function Layout({ children, params: { lang } }: PropsWithChildren<{ params: { lang: string } }>) {
  const route = useRouter()
  const [gameType, gameName] = useSelectedLayoutSegments()

  const localizedGames = GAMES_DICTIONARY[lang] ?? GAMES_DICTIONARY['ko']
  const localizedTabs = TABS[lang] ?? TABS['ko']

  const [activeTab, setActiveTab] = useState(gameType ?? localizedTabs[0].value)
  const [activeGame, setActiveGame] = useState(gameName ?? localizedGames[0].value)

  const handleGameChange = (value: string) => {
    setActiveGame(value)
    route.push(`/${lang}/user-guide/${gameType}/${value}`)
  }

  return (
    <div className='min-h-screen flex flex-col w-full md:w-[870px] text-app-text-color px-6 lg:px-16 my-10 mx-auto'>
      <div className='container mx-auto flex flex-col'>
        <div className='w-full mb-6'>
          <div className='flex gap-2 mb-4'>
            {localizedTabs.map(tab => (
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
            <Select value={activeGame} onValueChange={handleGameChange}>
              <SelectTrigger className='bg-app-white100 text-app-text-color'>
                <SelectValue placeholder='Select game' />
              </SelectTrigger>

              <SelectContent className='bg-app-background-primary'>
                {localizedGames.map((game, index) => (
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
