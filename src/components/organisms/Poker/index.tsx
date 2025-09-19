'use client'

import { GameCard } from '@/components/atoms/Card/GameCard'
import { GameListProps } from './types'
import { gameDTO } from '@/types/gameDTO'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { GetData } from '@/@core/hooks/use-query'
import { useSession } from 'next-auth/react'
import { stat } from 'fs'
import LoginModal from '../Login'

export default function PokerPage({
  lang,
  locale,
  initialPage,
  initialData,
  isInitialLoading,
  initialTotalPage
}: GameListProps) {
  const { data: session, status } = useSession()
  const isLogin = status === 'authenticated'
  const [listGame, setListGame] = useState<gameDTO[]>(initialData?.data || [])
  const [page, setPage] = useState(initialPage || 1)
  const [totalPage, setTotalPage] = useState(initialTotalPage || 1)
  const [isLoading, setIsLoading] = useState(isInitialLoading || false)
  const [loginOpen, setLoginOpen] = useState(false)

  const { data, isFetching, refetch } = GetData<{ data: gameDTO[]; totalPage: number }>(
    `/game_list`,
    ['getGameList', page],
    true,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'POST', // method
    {
      page,
      pageSize: 12
    },
    'transaction'
  )

  useEffect(() => {
    if (data) {
      setTotalPage(data.totalPage)

      setListGame(prev => {
        if (page === 1) {
          return data.data
        } else {
          // Check for duplicates before appending
          const existingIds = new Set(prev.map(game => game.id || `${game.title}-${game.provider}`))
          const newData = data.data.filter(game => !existingIds.has(game.id || `${game.title}-${game.provider}`))
          return [...prev, ...newData]
        }
      })

      setIsLoading(false)
    }
  }, [data, page])

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <main className='w-full min-h-screen px-4 py-6'>
      {/* Flex container using basis for columns */}
      <div className='flex flex-wrap gap-2'>
        {listGame &&
          listGame.map((items, i) => (
            <div
              key={i}
              className='
                basis-[calc((100%-0.5rem*2)/3)]         /* sm: gap-2 => 0.5rem; 2 gaps across 3 cols */
                md:basis-[calc((100%-0.5rem*5)/6)]      /* 6 cols => 5 gaps */
                shrink-0 min-w-0
            '
            >
              <GameCard
                id={items?.id}
                image={items.image}
                provider={items.provider}
                title={items.title}
                playersCount={Math.floor(Math.random() * 1000)} // Random players count for demo
                isLogin={isLogin}
                onRequireLogin={() => setLoginOpen(true)}
                className='w-full h-full min-w-0'
              />
            </div>
          ))}
      </div>

      {page < totalPage && (
        <div className='flex justify-center pb-4 pt-10'>
          <Button disabled={isFetching} onClick={handleLoadMore}>
            {isFetching ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
          </Button>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} locale={locale} />
    </main>
  )
}
