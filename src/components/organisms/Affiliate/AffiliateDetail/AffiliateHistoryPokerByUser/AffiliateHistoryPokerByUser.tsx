'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateHistoryDetailPokerDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { getTotalPage } from '@/utils/get-total-page'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface AffiliateHistoryPokerByUserProps {
  userId: string
  lang?: LangProps
  period: string
}

const pageSize = 10

export function AffiliateHistoryPokerByUser({ userId, lang, period }: AffiliateHistoryPokerByUserProps) {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const { data: respAffiliateHistoryPoker, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateHistoryDetailPokerDTO[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }>(
    `/v1/affiliate-history/poker/${userId}`,
    ['affiliate_history_poker_by_user', userId, period, page],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET', // method
    {
      page,
      pageSize,
      period
    },
    'user_proxy'
  )
  const affiliateHistoryPokerData = respAffiliateHistoryPoker?.data || []
  const totalPage = getTotalPage(respAffiliateHistoryPoker?.pagination?.total || 0, pageSize)

  return (
    <DataTable
      onRowClick={row => {
        router.push(`/affiliates/poker/${userId}/detail?period=${row.period}`)
      }}
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
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.username}</div>
              <div className='text-sm text-app-text-color'>{row.username ?? '-'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.parent}</div>
              <div className='text-sm text-app-text-color'>{row.parent?.username ?? '-'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.affiliateMember}</div>
              <div className='text-sm text-app-text-color'>{row.affiliated_members ?? '-'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.totalActiveUsers}</div>
              <div className='text-sm text-app-text-color'>{row.total_active_users ?? '-'}</div>
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
              <span className='text-xs text-gray-400'>{lang?.common?.commissionEarned}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.commission_earned != null ? thousandSeparatorComma(row.commission_earned) + '원' : '-'}
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
          key: 'username',
          header: lang?.common?.username,
          accessor: 'username',
          render: value => value ?? '-'
        },
        {
          key: 'parent',
          header: lang?.common?.parent,
          accessor: 'parent',
          render: value => value?.username ?? '-'
        },
        {
          key: 'affiliated_members',
          header: lang?.common?.affiliateMember,
          accessor: 'affiliated_members',
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
          key: 'total_active_users',
          header: lang?.common?.totalActiveUsers,
          accessor: 'total_active_users',
          render: value => value ?? '-'
        }
      ]}
    />
  )
}
