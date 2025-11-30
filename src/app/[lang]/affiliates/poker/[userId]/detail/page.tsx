import { DetailAffiliateHistoryPokerByUser } from '@/components/organisms/Affiliate/AffiliateDetail/AffiliateHistoryPokerByUser/DetailAffiliateHistoryPokerByUser'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function DetailAffiliateHistoryPokerByUserPage({
  params,
  searchParams
}: {
  params: { userId: string; lang: Locale }
  searchParams: { period: string }
}) {
  const { userId, lang } = params
  const dict = await getDictionary(lang)
  const locale = await getLocale()
  const { period } = searchParams
  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10 mx-auto'>
      <div className='flex flex-col'>
        {/* Header */}
        <div className='flex lg:flex-row flex-col mb-4 lg:mb-0 items-center justify-between'>
          <div className='w-full lg:mb-8 mb-2'>
            <Link
              href={`/${locale}/affiliates/poker/${userId}`}
              className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-2 p-0 h-auto hover:bg-transparent'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>{dict?.common?.back}</span>
            </Link>
            <div className='flex items-center gap-2 justify-between w-full flex-wrap'>
              <h1 className='text-2xl font-bold uppercase'>{dict?.affiliate?.detailAffiliateHistoryPokerByUser}</h1>
            </div>
          </div>
        </div>
        <DetailAffiliateHistoryPokerByUser userId={userId} lang={dict} period={period} />
      </div>
    </div>
  )
}
