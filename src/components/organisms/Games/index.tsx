'use client'

import { GetData } from '@/@core/hooks/use-query'
import { GameCard } from '@/components/atoms/Card/GameCard'
import { Button } from '@/components/ui/button'
import { gameDTO } from '@/types/gameDTO'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import LoginModal from '../Login'
import { GameListProps } from './types'
import { GameGridSkeleton } from '@/components/atoms/Skeleton/GameGridSkeleton'
import { GameCardSkeleton } from '@/components/atoms/Skeleton/GameCardSkeleton'
import GameCardLive from '@/components/atoms/Card/GameCardLive'

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
  const [gameId, setGameId] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)

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
  /** which card is opening */
  const [openingGameId, setOpeningGameId] = useState<string | null>(null)

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

  function stableCount(id: string, max = 700) {
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

  // detail: only when openingGameId is set
  // === DETAIL (only when openingGameId is set) ===
  const {
    data: gameDetail,
    isFetching: isFetchingGameDetail,
    error: gameDetailError
  } = GetData<any>(
    '/game_detail',
    ['getGameDetail', openingGameId],
    false, // skipAuth: require auth
    undefined, // initialData
    Boolean(openingGameId && isLogin), // enabled: only after click (+ logged in)
    false, // isShowMsg
    undefined, // successMessage
    { refetchOnWindowFocus: false, refetchOnReconnect: false }, // optional safety
    'POST',
    openingGameId ? { game_id: openingGameId, currency: 'KRW', lang: (locale ?? 'ko').toUpperCase() } : undefined,
    'transaction'
  )

  const openGamePopup = (url: string) => {
    const w = window.screen.availWidth
    const h = window.screen.availHeight
    const left = 0
    const top = 0

    // const w = 980
    // const h = 640
    // const left = window.screenX + (window.outerWidth - w) / 2
    // const top = window.screenY + (window.outerHeight - h) / 2

    const features = [
      `width=${w}`,
      `height=${h}`,
      `left=${left}`,
      `top=${top}`,
      'toolbar=0',
      'menubar=0',
      'location=0',
      'status=0',
      'resizable=1',
      'scrollbars=1'
    ].join(',')

    window.open(url, 'gamewin', features)
  }

  // When URL arrives → open new tab via /redirect → clear state
  useEffect(() => {
    if (!openingGameId) return

    // The hook might return { url } or { data: { url } } depending on your API.
    const launchUrl: string | undefined = gameDetail?.url ?? gameDetail?.data?.url

    if (launchUrl && !isFetchingGameDetail) {
      const redirect = `/redirect?url=${encodeURIComponent(launchUrl)}`
      // window.open(redirect, '_blank', 'noopener') // open in a new tab
      openGamePopup(redirect)
      setOpeningGameId(null)
    } else if (!isFetchingGameDetail && gameDetailError) {
      if (popupRef.current && !popupRef.current.closed) popupRef.current.close()
      popupRef.current = null
      console.error('Open game failed:', gameDetailError)
      setOpeningGameId(null)
    }
  }, [openingGameId, gameDetail, isFetchingGameDetail, gameDetailError])

  const onClickOpenGames = (id: string) => {
    if (!isLogin) {
      setLoginOpen(true)
      return
    }
    if (openingGameId) return // ignore double-clicks while opening

    // 2) proceed to fetch the launch url
    setOpeningGameId(id)
  }

  return (
    <main className='w-full min-h-screen px-4 py-4'>
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
                  onClick={() => setGameId(items.id)}
                  className='
                    basis-[calc((100%-0.5rem*2)/3)]
                    md:basis-[calc((100%-0.5rem*5)/6)]
                    shrink-0 min-w-0
                  '
                >
                  <GameCardLive
                    seedIndex={i}
                    lang={lang}
                    locale={locale}
                    id={items?.id}
                    image={items.image}
                    provider={items.provider}
                    title={items.title}
                    // playersCount={stableCount(items?.id || `${items.title}-${items.provider}`)}
                    isLogin={isLogin}
                    onRequireLogin={() => setLoginOpen(true)}
                    onClickOpenGames={(id: any) => onClickOpenGames(id)}
                    className='w-full h-full min-w-0'
                    isOpening={openingGameId === items.id && isFetchingGameDetail}
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
