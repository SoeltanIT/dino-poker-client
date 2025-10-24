// app/[lang]/play/[id]/page.tsx (or your current route)
import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import GameFrame from '@/components/organisms/GameFrame'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { authOptions } from '@/lib/authOptions'
import { getDetailGames } from '@/utils/api/internal/detailGame'
import { getServerSession } from 'next-auth'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const lang = await getDictionary(params?.lang) // you can still use dict if needed
  const locale = await getLocale()
  const session = await getServerSession(authOptions)
  const gameDetail = await getDetailGames({
    game_id: params?.id,
    currency: 'KRW',
    lang: (locale ?? 'ko').toUpperCase()
  })
  try {
    // const initialData = await getDetailGames({
    //   game_id: params?.id,
    //   currency: 'KRW',
    //   lang: (locale ?? 'ko').toUpperCase()
    // })

    return (
      <main className='w-full min-h-screen bg-background'>
        {/* If your header is 64–72px tall, pass that so the frame fits below it */}
        {/* <GameFrame src={initialData?.url} title={initialData?.title ?? 'Play Game'} /> */}
        <GameFrame src={gameDetail?.url} title={'Play Game'} />
      </main>
    )
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    if (err?.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null
    }
    console.error('PlayGamePage error:', err)
    return <div className='p-6 text-sm text-muted-foreground'>Failed to load game.</div>
  }
}
