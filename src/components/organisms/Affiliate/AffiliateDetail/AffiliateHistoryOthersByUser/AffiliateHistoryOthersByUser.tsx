'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateHistoryDetailOthersDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { getTotalPage } from '@/utils/get-total-page'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface AffiliateHistoryOthersByUserProps {
  userId: string
  lang?: LangProps
}

const pageSize = 10
export function AffiliateHistoryOthersByUser({ userId, lang }: AffiliateHistoryOthersByUserProps) {
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data: respAffiliateHistoryOthers, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateHistoryDetailOthersDTO[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }>(
    `/v1/affiliate-history/others/${userId}`,
    ['affiliate_history_others_by_user', userId, page],
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
      onRowClick={row => {
        router.push(`/affiliates/others/${userId}/detail?period=${row.period}`)
      }}
      emptyState={{
        message: lang?.common?.noAffiliateHistory,
        image: '/images/betNotFound.png'
      }}
      mobileHeader={lang?.common?.affiliateHistory}
      renderMobileRows={row => (
        <div className='bg-app-table-bg-body rounded-lg p-4 border border-app-table-border-body space-y-3'>
          {/* Header Section */}
          <div className='flex justify-between items-start pb-3 border-b border-app-table-border-body'>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.paidDate}</div>
              <div className='text-sm font-semibold text-app-text-color'>
                {row.paid_date ? format(new Date(row.paid_date), 'yyyy-MM-dd | HH:mm') : '-'}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.paidStatus}</div>
              <div className='text-sm font-semibold text-app-text-color'>{row.paid_status ?? '-'}</div>
            </div>
          </div>

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
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.parent}</div>
              <div className='text-sm text-app-text-color'>{row.parent?.username ?? '-'}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 mb-1'>{lang?.common?.affiliateMember}</div>
              <div className='text-sm text-app-text-color'>{row.affiliated_members ?? '-'}</div>
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

          {/* Last Commission Paid */}
          <div className='text-center pt-2 border-t border-app-table-border-body'>
            <div className='text-xs text-gray-400 mb-1'>{lang?.common?.lastCommissionPaid}</div>
            <div className='text-sm text-app-text-color'>
              {row.last_commission_paid_at ? format(new Date(row.last_commission_paid_at), 'yyyy-MM-dd | HH:mm') : '-'}
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
          key: 'paid_date',
          header: lang?.common?.paidDate,
          accessor: 'paid_date',
          render: value => (value ? format(new Date(value), 'yyyy-MM-dd | HH:mm') : '-')
        },
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
        },
        {
          key: 'last_commission_paid_at',
          header: lang?.common?.lastCommissionPaid,
          accessor: 'last_commission_paid_at',
          render: value => (value ? format(new Date(value), 'yyyy-MM-dd | HH:mm') : '-')
        },
        {
          key: 'paid_status',
          header: lang?.common?.paidStatus,
          accessor: 'paid_status',
          render: value => value ?? '-'
        }
      ]}
    />
  )
}
