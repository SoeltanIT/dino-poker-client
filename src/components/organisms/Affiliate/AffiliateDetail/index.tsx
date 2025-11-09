'use client'

import { AffiliateGroup } from '@/components/organisms/Affiliate/AffiliateDetail/AffiliateGroup'
import { Button } from '@/components/ui/button'
import { useClaimAffiliate, useClaimReferral } from '@/utils/api/internal/claimReferral'
import { useReferralSummary } from '@/utils/api/internal/getReferralSummary'
import { Gift } from 'lucide-react'
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
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8'>
          {/* Summary Stats */}
          <div className='lg:col-span-3'>
            <div className='mb-8 lg:mb-0'>
              <div className='gap-4 flex flex-row lg:flex-col w-full'>
                <div className='bg-app-background-secondary rounded-lg p-4 w-full'>
                  <div className='text-app-neutral500 text-sm mb-1'>{lang?.common?.totalBonus}</div>
                  <div className='text-2xl font-bold'>
                    <span className='text-app-success'> {totalBonus.toLocaleString()}</span>원
                  </div>
                </div>

                {roles !== 3 && (
                  <div className='hidden md:block bg-app-background-secondary rounded-lg p-4 w-full'>
                    <div className='text-app-neutral500 text-sm mb-2'>
                      {roles === 3 ? lang?.common?.claimAffiliate : lang?.common?.claimReferral || 'Claim Bonus'}
                    </div>
                    <div className='text-app-neutral500 text-xs mb-3'>
                      <p className='text-2xl font-bold text-app-text-color'>
                        <span className='text-app-success'> {totalAvailableCommission.toLocaleString()}</span>원
                      </p>
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          if (roles === 3) {
                            await claimAffiliate({ url: '/affiliate-claim', body: {} })
                          } else {
                            await claimReferral({ url: '/referral-claim', body: {} })
                          }
                        } catch (error) {
                          console.error('Failed to claim referral:', error)
                        }
                      }}
                      disabled={loadingState || totalAvailableCommission === 0}
                      className='w-full bg-app-primary hover:bg-app-primary-hover text-white'
                    >
                      {loadingState ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                          {lang?.common?.claiming || 'Claiming...'}
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <Gift className='w-4 h-4' />
                          {roles === 3 ? lang?.common?.claimAffiliate : lang?.common?.claimReferral || 'Claim'}
                        </div>
                      )}
                    </Button>
                  </div>
                )}

                <div className='bg-app-background-secondary rounded-lg p-4 w-full'>
                  <div className='text-app-neutral500 text-sm mb-1'>{lang?.common?.totalMember}</div>
                  <div className='text-2xl font-bold text-app-text-color'>{totalMembers}</div>
                </div>
              </div>
            </div>
            <div className='mb-4 md:hidden'>
              <div className='bg-app-background-secondary rounded-lg p-4 mb-3'>
                <div className='text-app-neutral500 text-sm mb-2'>
                  {roles === 3 ? lang?.common?.claimAffiliate : lang?.common?.claimReferral || 'Claim Bonus'}
                </div>
                <p className='text-2xl font-bold text-app-text-color'>
                  <span className='text-app-success'> {totalAvailableCommission.toLocaleString()}</span>원
                </p>
              </div>
              <Button
                onClick={async () => {
                  try {
                    if (roles === 3) {
                      await claimAffiliate({ url: '/affiliate-claim', body: {} })
                    } else {
                      await claimReferral({ url: '/referral-claim', body: {} })
                    }
                  } catch (error) {
                    console.error('Failed to claim referral:', error)
                  }
                }}
                disabled={loadingState || totalAvailableCommission === 0}
                className='w-full bg-app-primary hover:bg-app-primary-hover text-white'
              >
                {loadingState ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    {lang?.common?.claiming || 'Claiming...'}
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Gift className='w-4 h-4' />
                    {roles === 3 ? lang?.common?.claimAffiliate : lang?.common?.claimReferral || 'Claim'}
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Member List */}
          <div className='lg:col-span-9'>
            <AffiliateGroup lang={lang} />
          </div>
        </div>
      </div>
    </div>
  )
}
