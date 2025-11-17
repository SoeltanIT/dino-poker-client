'use client'

import { AffiliateHistoryGroup } from '@/components/organisms/Affiliate/AffiliateDetail/AffiliateHistoryGroup'
import { useClaimAffiliate, useClaimReferral } from '@/utils/api/internal/claimReferral'
import { useReferralSummary } from '@/utils/api/internal/getReferralSummary'
import { AffiliateDetailProps } from './types'

export default function AffiliateDetail({ lang, locale, initialSummaryData, roles }: AffiliateDetailProps) {
  // Claim referral functionality
  const { claimReferral, isLoading: isClaiming } = useClaimReferral(lang)
  const { claimAffiliate, isLoading: isAffiliateClaiming } = useClaimAffiliate(lang)

  let loadingState = roles === 3 ? isAffiliateClaiming : isClaiming

  const { data: referralSummaryData } = useReferralSummary(initialSummaryData || undefined)

  const summaryData = referralSummaryData || initialSummaryData

  // Use summary data for totals instead of calculating from history
  const totalBonus = summaryData?.data?.total_commission ?? 0
  const totalMembers = summaryData?.data?.total_referral_usage ?? 0
  const totalAvailableCommission = summaryData?.data?.available_commission ?? 0

  return (
    // <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10 mx-auto'>
    <div className='flex flex-col w-full text-app-text-color px-6 lg:px-20 mb-10 mx-auto'>
      <div className='flex flex-col'>
        {/* Desktop Header */}
        <div className='flex lg:flex-row flex-col mb-4 lg:mb-0 items-center justify-between'>
          <div className='w-full lg:mb-8 mb-2'>
            <h1 className='text-2xl font-bold uppercase'>{lang?.common?.myReferralDetail}</h1>
          </div>
        </div>
        <AffiliateHistoryGroup lang={lang} />
      </div>
    </div>
  )
}
