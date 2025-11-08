'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { Button } from '@/components/ui/button'
import { ReferralGroupHistoryItem } from '@/types/referralDTO'
import { useClaimAffiliate, useClaimReferral } from '@/utils/api/internal/claimReferral'
import { useReferralSummary } from '@/utils/api/internal/getReferralSummary'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { Gift } from 'lucide-react'
import { useState } from 'react'
import { MyReferralGroupHistoryProps } from './types'

export default function MyReferralGroupHistory({
  lang,
  locale,
  initialData,
  initialSummaryData,
  isLoading: serverLoading,
  roles
}: MyReferralGroupHistoryProps) {
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(serverLoading || false)

  // Claim referral functionality
  const { claimReferral, isLoading: isClaiming } = useClaimReferral(lang)
  const { claimAffiliate, isLoading: isAffiliateClaiming } = useClaimAffiliate(lang)

  let loadingState = roles === 3 ? isAffiliateClaiming : isClaiming

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

  const members = respReferralGroupHistory?.data || []

  const totalPage = respReferralGroupHistory?.totalPage || 0

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
            {/* <Link
              href={`/${locale}/my-referral`}
              className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-2 p-0 h-auto hover:bg-transparent'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>{lang?.common?.back}</span>
            </Link> */}
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
            {/* Desktop Table */}
            <DataTable
              onRowClick={row => {
                console.log(row)
              }}
              emptyState={{
                message: lang?.common?.noMemberReferral,
                image: '/images/betNotFound.png'
              }}
              mobileHeader={lang?.common?.memberList}
              renderMobileRows={row => (
                <div className='bg-app-table-bg-body rounded-lg p-4 border border-app-table-border-body'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <div className='text-sm'>{format(new Date(row?.created_at), 'yyyy-MM-dd | HH:mm')}</div>
                      <div className='font-semibold text-app-text-color'>{row.commission_percentage}%</div>
                    </div>
                    <div className='text-right text-sm'>
                      <span className='text-app-success font-bold text-lg'>{thousandSeparatorComma(row.amount)}</span>원
                    </div>
                  </div>
                </div>
              )}
              pagination={{
                currentPage: page,
                totalPages: totalPage,
                onPageChange: setPage
              }}
              data={members}
              loading={isFetchingHistory}
              columns={[
                {
                  key: 'date',
                  header: lang?.common?.date,
                  accessor: 'created_at',
                  render: value => format(new Date(value), 'yyyy-MM-dd | HH:mm')
                },
                {
                  key: 'referralGroup',
                  header: lang?.common?.referralGroup,
                  accessor: 'parent',
                  render: value => value ?? '-'
                },
                {
                  key: 'commissionPercentage',
                  header: lang?.common?.commissionPercentage,
                  accessor: 'commission_percentage',
                  render: value => value + '%'
                },
                {
                  key: 'commission',
                  header: lang?.common?.commission,
                  accessor: 'amount',
                  render: value => (
                    <div className='text-app-text-color'>
                      <span className='text-app-success font-bold'>{thousandSeparatorComma(value)}</span>원
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
