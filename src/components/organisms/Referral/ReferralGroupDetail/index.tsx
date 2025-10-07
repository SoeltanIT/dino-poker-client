'use client'

import { GetData } from '@/@core/hooks/use-query'
import { Button } from '@/components/ui/button'
import { ReferralGroupHistoryItem, ReferralHistoryItem } from '@/types/referralDTO'
import { useClaimReferral } from '@/utils/api/internal/claimReferral'
import { useReferralSummary } from '@/utils/api/internal/getReferralSummary'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { ArrowLeft, Gift } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MyReferralGroupHistoryProps } from './types'

export default function MyReferralGroupHistory({
  lang,
  locale,
  initialData,
  initialSummaryData,
  isLoading: serverLoading
}: MyReferralGroupHistoryProps) {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(initialData?.totalPage || 1)
  const [members, setMembers] = useState<ReferralGroupHistoryItem[]>(initialData?.data || [])

  const [isLoading, setIsLoading] = useState(serverLoading || false)

  // Claim referral functionality
  const { claimReferral, isLoading: isClaiming } = useClaimReferral(lang)

  // Use client-side hooks for data fetching with server-side initial data
  const { data: respReferralGroupHistory, isFetching: isFetchingHistory } = GetData<{
    data: ReferralGroupHistoryItem[]
    totalPage: number
  }>(
    `/referral-group-history`,
    ['referral_group_history', page], // You can still use this as queryKey cache
    true,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'POST', // method
    {
      page,
      pageSize: 10
    },
    'user'
  )

  const {
    data: referralSummaryData,
    isLoading: clientSummaryLoading,
    error: summaryError
  } = useReferralSummary(initialSummaryData || undefined)

  const summaryData = referralSummaryData || initialSummaryData

  // Update members and pagination when data changes
  useEffect(() => {
    setIsLoading(true)
    if (respReferralGroupHistory) {
      setTotalPage(respReferralGroupHistory.totalPage)

      setMembers(prev => {
        if (page === 1) {
          return respReferralGroupHistory?.data
        } else {
          // Check for duplicates before appending
          const existingIds = new Set(prev.map(member => `${member.created_at}-${member.commission_percentage}`))
          const newData = respReferralGroupHistory?.data.filter(
            member => !existingIds.has(`${member.created_at}-${member.commission_percentage}`)
          )
          return [...prev, ...newData]
        }
      })
      setIsLoading(false)
    }
  }, [respReferralGroupHistory, page])
  // Use summary data for totals instead of calculating from history
  const totalBonus = summaryData?.data?.total_commission ?? 0
  const totalMembers = summaryData?.data?.total_referral_usage ?? 0
  const totalAvailableCommission = summaryData?.data?.available_commission ?? 0

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10 mx-auto'>
      <div className='flex flex-col'>
        {/* Back Button */}

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
            <h1 className='text-2xl font-bold uppercase'>{lang?.common?.myReferralDetail}</h1>
          </div>

          {/* <DateRangePicker
            locale={locale}
            labelFrom={lang?.common?.selectDateFrom}
            labelTo={lang?.common?.selectDateTo}
            placeholder={lang?.register?.selectDate}
            onChange={({ from, to }) => {
              setDateFrom(from)
              setDateTo(to)
              // Reset to page 1 when date filter changes
              setPage(1)
            }}
            toastInfo={lang?.info?.infoDate}
          /> */}
        </div>

        <div className='lg:flex lg:gap-8'>
          {/* Summary Stats */}
          <div className='lg:w-64 mb-8 lg:mb-0'>
            <div className='gap-4 flex flex-row lg:flex-col w-full'>
              <div className='bg-app-background-secondary rounded-lg p-4 w-full'>
                <div className='text-app-neutral500 text-sm mb-1'>{lang?.common?.totalBonus}</div>
                <div className='text-2xl font-bold'>
                  KRW <span className='text-app-success'> {totalBonus.toLocaleString()}</span>
                </div>
              </div>

              <div className='hidden md:block bg-app-background-secondary rounded-lg p-4 w-full'>
                <div className='text-app-neutral500 text-sm mb-2'>
                  {lang?.common?.claimReferral || 'Claim Referral Bonus'}
                </div>
                <div className='text-app-neutral500 text-xs mb-3'>
                  <p className='text-2xl font-bold text-app-text-color'>
                    KRW
                    <span className='text-app-success'>{` ${totalAvailableCommission.toLocaleString()}`}</span>
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      await claimReferral({ url: '/referral-claim', body: {} })
                    } catch (error) {
                      console.error('Failed to claim referral:', error)
                    }
                  }}
                  disabled={isClaiming || totalAvailableCommission === 0}
                  className='w-full bg-app-primary hover:bg-app-primary-hover text-white'
                >
                  {isClaiming ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      {lang?.common?.claiming || 'Claiming...'}
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Gift className='w-4 h-4' />
                      {lang?.common?.claimReferral || 'Claim Referral'}
                    </div>
                  )}
                </Button>
              </div>
              <div className='bg-app-background-secondary rounded-lg p-4 w-full'>
                <div className='text-app-neutral500 text-sm mb-1'>{lang?.common?.totalMember}</div>
                <div className='text-2xl font-bold text-app-text-color'>{totalMembers}</div>
              </div>
            </div>
          </div>
          <div className='mb-4 md:hidden'>
            <div className='bg-app-background-secondary rounded-lg p-4 mb-3'>
              <div className='text-app-neutral500 text-sm mb-2'>
                {lang?.common?.claimReferral || 'Claim Referral Bonus'}
              </div>
              <p className='text-2xl font-bold text-app-text-color'>
                KRW
                <span className='text-app-success'>{` ${totalAvailableCommission.toLocaleString()}`}</span>
              </p>
            </div>
            <Button
              onClick={async () => {
                try {
                  await claimReferral({ url: '/referral-claim', body: {} })
                } catch (error) {
                  console.error('Failed to claim referral:', error)
                }
              }}
              disabled={isClaiming || totalAvailableCommission === 0}
              className='w-full bg-app-primary hover:bg-app-primary-hover text-white'
            >
              {isClaiming ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  {lang?.common?.claiming || 'Claiming...'}
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Gift className='w-4 h-4' />
                  {lang?.common?.claimReferral || 'Claim Referral'}
                </div>
              )}
            </Button>
          </div>
          {/* Member List */}
          <div className='flex-1'>
            {/* Mobile Member List */}
            <div className='lg:hidden'>
              <h2 className='text-lg font-semibold mb-4'>{lang?.common?.memberList}</h2>

              {/* Mobile Claim Button */}

              {!isLoading && members.length > 0 ? (
                <div className='space-y-3'>
                  {members.map((member, index) => (
                    <div key={index} className='bg-app-background-secondary rounded-lg p-4 border border-gray-800'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <div className='text-app-neutral500 text-sm'>
                            {format(new Date(member?.created_at), 'yyyy-MM-dd | HH:mm')}
                          </div>
                          <div className='font-semibold text-app-text-color'>{member.commission_percentage}%</div>
                        </div>
                        <div className='text-right'>
                          <div className='text-app-neutral500 text-sm'>KRW</div>
                          <div className='text-app-success font-bold text-lg'>
                            {thousandSeparatorComma(member.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-8 text-center flex flex-col gap-3 items-center'>
                  <Image
                    src={'/images/betNotFound.png'}
                    alt='Bet Not Found'
                    width={1000}
                    height={1000}
                    className='h-[100px] w-[100px] object-contain object-center'
                  />
                  <p className='text-gray-300'>{lang?.common?.noMemberReferral}.</p>
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className='hidden lg:block'>
              <div className='overflow-hidden'>
                <div className='hidden items-center md:grid md:grid-cols-4 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase'>
                  <div>{lang?.common?.date}</div>
                  <div>{lang?.common?.referralGroup}</div>
                  <div>{lang?.common?.commissionPercentage}</div>
                  <div>{lang?.common?.commission}</div>
                </div>

                <div className='rounded-lg bg-app-background-secondary border border-app-neutral600'>
                  {!isLoading && members.length > 0 ? (
                    members.map((member, index) => (
                      <div key={index} className='grid grid-cols-4 gap-4 p-4 last:border-b-0'>
                        <div className='text-app-text-color'>
                          {format(new Date(member?.created_at), 'yyyy-MM-dd | HH:mm')}
                        </div>
                        <div className='text-app-text-color'>{member.parent}</div>
                        <div className='text-app-text-color'>{member.commission_percentage}%</div>
                        <div className='text-app-text-color'>
                          KRW{' '}
                          <span className='text-app-success font-bold'>{thousandSeparatorComma(member.amount)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='p-8 text-center flex flex-col gap-3 items-center'>
                      <Image
                        src={'/images/betNotFound.png'}
                        alt='Bet Not Found'
                        width={1000}
                        height={1000}
                        className='h-[100px] w-[100px] object-contain object-center'
                      />
                      <p className='text-gray-300'>{lang?.common?.noMemberReferral}.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Load More */}
            {page < totalPage && (
              <div className='flex justify-center py-4'>
                <Button disabled={isFetchingHistory} onClick={handleLoadMore}>
                  {isFetchingHistory ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
