'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateSummaryPokerDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useState } from 'react'

export interface DetailAffiliateHistoryPokerByUserProps {
  userId: string
  lang?: LangProps
}

export function DetailAffiliateHistoryPokerByUser({ userId, lang }: DetailAffiliateHistoryPokerByUserProps) {
  const [page, setPage] = useState(1)

  const { data: respAffiliateHistoryPoker, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateSummaryPokerDTO[]
    totalPage: number
  }>(
    `/v1/affiliate-history/poker/${userId}/details`,
    ['detail_affiliate_history_poker_by_user', userId, page],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET', // method
    {
      page,
      pageSize: 10
    },
    'user_proxy'
  )
  const affiliateHistoryPokerData = respAffiliateHistoryPoker?.data || []
  const totalPage = respAffiliateHistoryPoker?.totalPage || 0

  return (
    <DataTable
      emptyState={{
        message: lang?.common?.noAffiliateHistory,
        image: '/images/betNotFound.png'
      }}
      mobileHeader={lang?.common?.affiliateHistory}
      renderMobileRows={row => (
        <div className='bg-app-table-bg-body rounded-lg p-4 border border-app-table-border-body space-y-3'>
          {/* User Info Section */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.codeName}</div>
              <div className='text-sm text-app-text-color'>{row.code_name ?? '-'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.username}</div>
              <div className='text-sm text-app-text-color'>{row.username ?? '-'}</div>
            </div>
          </div>

          {/* Period */}
          <div>
            <div className='text-xs text-gray-400 mb-1'>{lang?.common?.period}</div>
            <div className='text-sm text-app-text-color'>{row.period ?? '-'}</div>
          </div>

          {/* Financial Info Section */}
          <div className='bg-app-table-bg-header rounded-lg p-3 space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.rakeAmount}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.rake_amount != null ? thousandSeparatorComma(row.rake_amount) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.commissionRate}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.commission_rate != null ? row.commission_rate * 100 + '%' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.commissionEarned}</span>
              <span className='text-sm font-semibold text-green-500'>
                {row.commission_earned != null ? thousandSeparatorComma(row.commission_earned) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.adjustedCommission}</span>
              <span className='text-sm font-semibold text-blue-500'>
                {row.adjusted_commission != null ? thousandSeparatorComma(row.adjusted_commission) + '원' : '-'}
              </span>
            </div>
          </div>
        </div>
      )}
      pagination={{
        currentPage: page,
        totalPages: totalPage,
        onPageChange: setPage
      }}
      data={affiliateHistoryPokerData}
      loading={isFetchingHistory}
      columns={[
        {
          key: 'code_name',
          header: lang?.common?.codeName,
          accessor: 'code_name',
          render: value => value ?? '-'
        },
        {
          key: 'username',
          header: lang?.common?.username,
          accessor: 'username',
          render: value => value ?? '-'
        },
        {
          key: 'period',
          header: lang?.common?.period,
          accessor: 'period',
          render: value => value ?? '-'
        },
        {
          key: 'rake_amount',
          header: lang?.common?.rakeAmount,
          accessor: 'rake_amount',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'commission_earned',
          header: lang?.common?.commissionEarned,
          accessor: 'commission_earned',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'adjusted_commission',
          header: lang?.common?.adjustedCommission,
          accessor: 'adjusted_commission',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'commission_rate',
          header: lang?.common?.commissionRate,
          accessor: 'commission_rate',
          render: value => (value != null ? value * 100 + '%' : '-')
        }
      ]}
    />
  )
}
