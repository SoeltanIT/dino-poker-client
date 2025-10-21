'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AffiliateList } from './AffiliateList'
import { AffiliateUserList } from './AffiliateUserList'
import { CreateAffiliateSheet } from './createAffiliate'
import { MyAffiliateProps } from './types'

export default function MyAffiliate({
  lang,
  locale,
  initialAffiliateData,
  myReferralData,
  initialAffiliateUserData
}: MyAffiliateProps) {
  const [tabValue, setTabValue] = useState<string>('affiliate')

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10 mx-auto'>
      <div className='flex flex-col'>
        {/* Header */}
        {/* Desktop Header */}
        <div className='flex lg:flex-row flex-col mb-4 lg:mb-0 items-center justify-between'>
          <div className='w-full lg:mb-8 mb-2'>
            <Link
              href={`/${locale}/my-referral`}
              className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-2 p-0 h-auto hover:bg-transparent'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>{lang?.common?.back}</span>
            </Link>
            <div className='flex items-center gap-2 justify-between w-full flex-wrap'>
              <h1 className='text-2xl font-bold uppercase'>{lang?.common?.createAffiliate}</h1>
              <CreateAffiliateSheet
                lang={lang || {}}
                parentCode={myReferralData?.referral_code}
                // onSuccess={() => refetchSettings()}
              />
            </div>
          </div>
        </div>
        <Tabs value={tabValue} onValueChange={setTabValue} className='w-full'>
          <TabsList className='flex items-center justify-between pb-6 mt-6'>
            <div className='flex space-x-4'>
              <TabsTrigger
                value='affiliate'
                className={`text-lg font-medium transition-colors uppercase ${
                  tabValue === 'affiliate' ? 'text-app-text-color' : 'text-app-neutral500'
                }`}
              >
                {lang?.common?.affiliate}
              </TabsTrigger>
              <TabsTrigger
                value='user_affiliate'
                className={`text-lg font-medium transition-colors uppercase ${
                  tabValue === 'user_affiliate' ? 'text-app-text-color' : 'text-app-neutral500'
                }`}
              >
                {lang?.common?.userAffiliate}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value='affiliate'>
            <AffiliateList lang={lang || {}} locale={locale} initialAffiliateData={initialAffiliateData} />
          </TabsContent>

          <TabsContent value='user_affiliate'>
            <AffiliateUserList lang={lang || {}} locale={locale} initialAffiliateUserData={initialAffiliateUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
