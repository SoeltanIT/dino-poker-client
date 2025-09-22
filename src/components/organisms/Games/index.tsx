'use client'

import { GetData } from '@/@core/hooks/use-query'
import { GameCard } from '@/components/atoms/Card/GameCard'
import { Button } from '@/components/ui/button'
import { gameDTO } from '@/types/gameDTO'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import LoginModal from '../Login'
import { GameListProps } from './types'
import { GameGridSkeleton } from '@/components/atoms/Skeleton/GameGridSkeleton'
import { GameCardSkeleton } from '@/components/atoms/Skeleton/GameCardSkeleton'

export default function ListGamePage({
  lang,
  locale,
  initialPage,
  initialData,
  isInitialLoading,
  initialTotalPage
}: GameListProps) {
  const { data: session, status } = useSession()
  const isLogin = status === 'authenticated'
  const roles = (session?.user as any)?.roles || 2
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

  function stableCount(id: string, max = 1000) {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i)
    return Math.abs(h) % max
  }

  // NEW: loading flags
  const showInitialSkeleton = useMemo(
    () => (isLoading || isFetching) && page === 1 && listGame.length === 0,
    [isLoading, isFetching, page, listGame.length]
  )
  const showAppendSkeleton = useMemo(() => isFetching && page > 1, [isFetching, page])

  return (
    <main className='w-full min-h-screen px-4 py-6'>
      {/* Flex container using basis for columns */}
      {roles === 3 ? (
        <div className='flex min-h-screen items-center justify-center py-24 text-center gap-4'>
          <span className='text-app-text-color text-2xl w-[50%]'>{lang?.common?.rolesMsgHomepage}</span>
        </div>
      ) : (
        <div>
          {/* GRID */}
          {showInitialSkeleton ? (
            <GameGridSkeleton count={12} />
          ) : (
            <div className='flex flex-wrap gap-2'>
              {listGame?.map((items, i) => (
                <div
                  key={i}
                  className='
                    basis-[calc((100%-0.5rem*2)/3)]
                    md:basis-[calc((100%-0.5rem*5)/6)]
                    shrink-0 min-w-0
                  '
                >
                  <GameCard
                    id={items?.id}
                    image={items.image}
                    provider={items.provider}
                    title={items.title}
                    playersCount={stableCount(items?.id || `${items.title}-${items.provider}`)}
                    isLogin={isLogin}
                    onRequireLogin={() => setLoginOpen(true)}
                    className='w-full h-full min-w-0'
                  />
                </div>
              ))}

              {/* Append skeletons while fetching the next page */}
              {showAppendSkeleton &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className='
                      basis-[calc((100%-0.5rem*2)/3)]
                      md:basis-[calc((100%-0.5rem*5)/6)]
                      shrink-0 min-w-0
                    '
                  >
                    <GameCardSkeleton className='w-full h-full min-w-0' />
                  </div>
                ))}
            </div>
          )}

          {/* LOAD MORE */}
          {page < totalPage && (
            <div className='flex justify-center pb-4 pt-10'>
              <Button disabled={isFetching} onClick={handleLoadMore}>
                {isFetching ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
              </Button>
            </div>
          )}
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} locale={locale} />
    </main>
  )
}
