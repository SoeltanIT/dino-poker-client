'use client'

import { GetData } from '@/@core/hooks/use-query'
import GameCardLive from '@/components/atoms/Card/GameCardLive'
import { GameCardSkeleton } from '@/components/atoms/Skeleton/GameCardSkeleton'
import { GameGridSkeleton } from '@/components/atoms/Skeleton/GameGridSkeleton'
import { Button } from '@/components/ui/button'
import { gameDTO } from '@/types/gameDTO'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { keepPreviousData } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import LoginModal from '../Login'
import { GameListProps } from './types'
import { getGameImage } from '@/utils/helper/getGameImage'

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
  const [listGame, setListGame] = useState<gameDTO[]>(initialData || [])
  const [page, setPage] = useState(initialPage || 1)
  const [totalPage, setTotalPage] = useState(initialTotalPage || 1)
  const [isLoading, setIsLoading] = useState(isInitialLoading || false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)
  /** which card is opening */
  const [openingGameId, setOpeningGameId] = useState<string | null>(null)

  const { theme } = useThemeToggle()

  const {
    data: dataList,
    isFetching,
    isSuccess,
    refetch
  } = GetData<{ data: gameDTO[]; totalPage: number }>(
    '/game_list',
    ['getGameList', page],
    /* skipAuth */ true,
    /* initialData */ undefined,
    /* enabled */ true,
    /* isShowMsg */ false,
    /* successMessage */ undefined,
    {
      // 👇 Only fire when page > 1 (after user clicks "Load more")
      enabled: page > 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      placeholderData: keepPreviousData
    },
    'GET',
    { page, pageSize: 12 }, // 👈 becomes ?page=..&pageSize=.. in GET
    'transaction',
    { sMaxage: 120, swr: 60, cacheKey: `games-page-${page}` }
  )

  useEffect(() => {
    if (!isSuccess || !dataList) return
    setTotalPage(dataList.totalPage)
    setListGame(prev => {
      if (page === 1) return dataList.data
      const ids = new Set(prev.map(g => g.id || `${g.title}-${g.provider}`))
      const next = dataList.data.filter(g => !ids.has(g.id || `${g.title}-${g.provider}`))
      return [...prev, ...next]
    })
  }, [isSuccess, dataList, page])

  // useEffect(() => {
  //   console.log('here > 0')
  //   if (dataList) {
  //     setTotalPage(dataList.totalPage)
  //     console.log('here > 1', dataList)
  //     // setListGame(prev => {
  //     //   if (page === 1) {
  //     //     console.log('here > 2', dataList)
  //     //     console.log('here > 2', dataList?.data)
  //     //     return dataList?.data
  //     //   } else {
  //     //     console.log('here > 3')
  //     //     // Check for duplicates before appending
  //     //     const existingIds = new Set(prev.map(game => game.id || `${game.title}-${game.provider}`))
  //     //     const newData = dataList.data.filter(game => !existingIds.has(game.id || `${game.title}-${game.provider}`))
  //     //     return [...prev, ...newData]
  //     //   }
  //     // })

  //     setIsLoading(false)
  //   }
  // }, [dataList, page])

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  // NEW: loading flags
  const showInitialSkeleton = useMemo(
    () => (isLoading || isFetching) && page === 1 && listGame.length === 0,
    [isLoading, isFetching, page, listGame?.length]
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

    const features_window = [
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

    window.open(url, 'gamewin', features_window)
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

  const PRIORITY_COUNT = 12

  return (
    <main className='w-full min-h-screen py-4'>
      {/* Flex container using basis for columns */}
      {/* {roles === 3 ? (
        <div className='flex min-h-screen items-center justify-center py-24 text-center gap-4'>
          <span className='text-app-text-color text-2xl w-[50%]'>{lang?.common?.rolesMsgHomepage}</span>
        </div>
      ) : listGame ? (
        <div>
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
                    isLogin={isLogin}
                    onRequireLogin={() => setLoginOpen(true)}
                    onClickOpenGames={(id: any) => onClickOpenGames(id)}
                    className='w-full h-full min-w-0'
                    isOpening={openingGameId === items.id && isFetchingGameDetail}
                    priority={page === 1 && i < PRIORITY_COUNT}
                  />
                </div>
              ))}

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

          {page < totalPage && (
            <div className='flex justify-center pb-4 pt-10'>
              <Button disabled={isFetching} onClick={handleLoadMore}>
                {isFetching ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <GameGridSkeleton count={12} />
      )} */}

      <div>
        {/* GRID */}
        {showInitialSkeleton ? (
          <GameGridSkeleton count={12} />
        ) : (
          <div key={`${theme}-${locale}`} className='flex flex-wrap gap-2'>
            {listGame?.map((items, i) => {
              const showImage = getGameImage(items, theme, locale)
              const stableId = items?.id || `${items.title}-${items.provider}`
              return (
                <div
                  // 👉 key stabil + ikut theme/locale supaya tiap card remount saat theme/locale berubah
                  key={`${stableId}-${theme}-${locale}`}
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
                    image={showImage}
                    provider={items.provider}
                    title={items.title}
                    isLogin={isLogin}
                    onRequireLogin={() => setLoginOpen(true)}
                    onClickOpenGames={onClickOpenGames}
                    className='w-full h-full min-w-0'
                    isOpening={openingGameId === items.id && isFetchingGameDetail}
                    priority={page === 1 && i < PRIORITY_COUNT}
                  />
                </div>
              )
            })}

            {/* Append skeletons while fetching the next page */}
            {showAppendSkeleton &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`sk-${i}-${theme}-${locale}`}
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

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} locale={locale} />
    </main>
  )
}
