'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateSummaryOthersDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { getTotalPage } from '@/utils/get-total-page'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export interface DetailAffiliateHistoryOthersByUserProps {
  userId: string
  lang?: LangProps
}

const pageSize = 10

export function DetailAffiliateHistoryOthersByUser({ userId, lang }: DetailAffiliateHistoryOthersByUserProps) {
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const period = searchParams.get('period')

  const { data: respAffiliateHistoryOthers, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateSummaryOthersDTO[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }>(
    `/v1/affiliate-history/betby/${userId}/details`,
    ['detail_affiliate_history_others_by_user', userId, page, period],
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
  const affiliateHistoryOthersData = respAffiliateHistoryOthers?.data || []
  const totalPage = getTotalPage(respAffiliateHistoryOthers?.pagination?.total || 0, pageSize)

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
              <span className='text-xs text-gray-400'>{lang?.common?.totalNGR}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.ngr != null ? thousandSeparatorComma(row.ngr) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.commissionEarned}</span>
              <span className='text-sm font-semibold text-green-500'>
                {row.commission_earned != null ? thousandSeparatorComma(row.parent_commission) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.commissionRate}</span>
              <span className='text-sm font-semibold text-blue-500'>
                {row.commission_rate != null ? `${row.parent_commission_rate}%` : '-'}
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
      data={affiliateHistoryOthersData}
      loading={isFetchingHistory}
      columns={[
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
          key: 'ngr',
          header: lang?.common?.totalNGR,
          accessor: 'ngr',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'commission_earned',
          header: lang?.common?.commissionEarned,
          accessor: 'parent_commission',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'commission_rate',
          header: lang?.common?.commissionRate,
          accessor: 'parent_commission_rate',
          render: value => (value != null ? `${value}%` : '-')
        }
      ]}
    />
  )
}
