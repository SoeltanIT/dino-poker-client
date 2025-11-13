'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateSummaryOthersDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { getTotalPage } from '@/utils/get-total-page'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useState } from 'react'

export interface DetailAffiliateHistoryOthersByUserProps {
  userId: string
  lang?: LangProps
}

const pageSize = 10

export function DetailAffiliateHistoryOthersByUser({ userId, lang }: DetailAffiliateHistoryOthersByUserProps) {
  const [page, setPage] = useState(1)

  const { data: respAffiliateHistoryOthers, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateSummaryOthersDTO[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }>(
    `/v1/affiliate-history/others/${userId}/details`,
    ['detail_affiliate_history_others_by_user', userId, page],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET', // method
    {
      page,
      pageSize
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
              <span className='text-xs text-gray-400'>{lang?.common?.previousNGR}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.previous_ngr != null ? thousandSeparatorComma(row.previous_ngr) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalBet}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_bet != null ? thousandSeparatorComma(row.total_bet) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalWin}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_win != null ? thousandSeparatorComma(row.total_win) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalGGR}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_ggr != null ? thousandSeparatorComma(row.total_ggr) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalBonus}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_bonus != null ? thousandSeparatorComma(row.total_bonus) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalPromotion}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_promotion != null ? thousandSeparatorComma(row.total_promotion) + '원' : '-'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-gray-400'>{lang?.common?.totalNGR}</span>
              <span className='text-sm font-medium text-app-text-color'>
                {row.total_ngr != null ? thousandSeparatorComma(row.total_ngr) + '원' : '-'}
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
      data={affiliateHistoryOthersData}
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
          key: 'previous_ngr',
          header: lang?.common?.previousNGR,
          accessor: 'previous_ngr',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_bet',
          header: lang?.common?.totalBet,
          accessor: 'total_bet',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_win',
          header: lang?.common?.totalWin,
          accessor: 'total_win',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_ggr',
          header: lang?.common?.totalGGR,
          accessor: 'total_ggr',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_bonus',
          header: lang?.common?.totalBonus,
          accessor: 'total_bonus',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_promotion',
          header: lang?.common?.totalPromotion,
          accessor: 'total_promotion',
          render: value => (value != null ? thousandSeparatorComma(value) + '원' : '-')
        },
        {
          key: 'total_ngr',
          header: lang?.common?.totalNGR,
          accessor: 'total_ngr',
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
        }
      ]}
    />
  )
}
