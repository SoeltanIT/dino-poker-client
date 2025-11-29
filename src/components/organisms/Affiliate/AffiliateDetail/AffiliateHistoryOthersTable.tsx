'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { AffiliateHistoryOthersDTO } from '@/types/affiliateDTO'
import { LangProps } from '@/types/langProps'
import { getTotalPage } from '@/utils/get-total-page'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface AffiliateHistoryOthersTableProps {
  lang?: LangProps
}

const pageSize = 10

export function AffiliateHistoryOthersTable({ lang }: AffiliateHistoryOthersTableProps) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  // Use client-side hooks for data fetching with server-side initial data
  const { data: respAffiliateHistoryOthers, isFetching: isFetchingHistory } = GetData<{
    data: AffiliateHistoryOthersDTO[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }>(
    `/v1/affiliate-history/others`,
    ['affiliate_history_others', page], // You can still use this as queryKey cache
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

  const members = respAffiliateHistoryOthers?.data || []
  const totalPage = getTotalPage(respAffiliateHistoryOthers?.pagination?.total || 0, pageSize)
  return (
    <>
      {/* Desktop Table */}
      <DataTable
        onRowClick={row => {
          router.push(`/affiliates/others/${row.user_id}`)
        }}
        emptyState={{
          message: lang?.common?.noAffiliateHistory,
          image: '/images/betNotFound.png'
        }}
        mobileHeader={lang?.common?.affiliateHistory}
        renderMobileRows={row => (
          <div className='bg-app-table-bg-body rounded-lg p-4 border border-app-table-border-body space-y-2'>
            <div className='flex justify-between items-start'>
              <div>
                <div className='text-xs text-gray-500'>{lang?.common?.paidDate}</div>
                <div className='text-sm font-semibold'>{format(new Date(row?.paid_date), 'yyyy-MM-dd | HH:mm')}</div>
              </div>
              <div className='text-right'>
                <div className='text-xs text-gray-500'>{lang?.common?.paidStatus}</div>
                <div className='font-semibold text-app-text-color'>{row.paid_status}</div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div>
                <div className='text-xs text-gray-500'>{lang?.common?.username}</div>
                <div>{row.username}</div>
              </div>
              <div>
                <div className='text-xs text-gray-500'>{lang?.common?.period}</div>
                <div>{row.period}</div>
              </div>
              <div>
                <div className='text-xs text-gray-500'>{lang?.common?.parent}</div>
                <div>{row.parent?.username ?? '-'}</div>
              </div>
            </div>
            <div className='border-t border-app-table-border-body pt-2'>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <div className='text-xs text-gray-500'>{lang?.common?.totalBet}</div>
                  <div>{thousandSeparatorComma(row.total_bet)}원</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>{lang?.common?.totalWin}</div>
                  <div>{thousandSeparatorComma(row.total_win)}원</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>{lang?.common?.commissionEarned}</div>
                  <div className='text-app-success font-bold'>{thousandSeparatorComma(row.commission_earned)}원</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>{lang?.common?.adjustedCommission}</div>
                  <div className='text-app-success font-bold'>{thousandSeparatorComma(row.adjusted_commission)}원</div>
                </div>
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
            key: 'paidDate',
            header: lang?.common?.paidDate,
            accessor: 'paid_date',
            render: value => format(new Date(value), 'yyyy-MM-dd | HH:mm')
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
            key: 'affiliatedMembers',
            header: lang?.common?.affiliateMember,
            accessor: 'affiliated_members',
            render: value => value?.toString() ?? '0'
          },
          {
            key: 'period',
            header: lang?.common?.period,
            accessor: 'period',
            render: value => value ?? '-'
          },
          {
            key: 'previousNGR',
            header: lang?.common?.previousNGR,
            accessor: 'previous_ngr',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalBet',
            header: lang?.common?.totalBet,
            accessor: 'total_bet',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalWin',
            header: lang?.common?.totalWin,
            accessor: 'total_win',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalGGR',
            header: lang?.common?.totalGGR,
            accessor: 'total_ggr',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalBonus',
            header: lang?.common?.totalBonus,
            accessor: 'total_bonus',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalPromotion',
            header: lang?.common?.totalPromotion,
            accessor: 'total_promotion',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'totalNGR',
            header: lang?.common?.totalNGR,
            accessor: 'total_ngr',
            render: value => <div className='text-app-text-color'>{thousandSeparatorComma(value)}원</div>
          },
          {
            key: 'reason',
            header: lang?.common?.reason,
            accessor: 'reason',
            render: value => value ?? '-'
          },
          {
            key: 'commissionEarned',
            header: lang?.common?.commissionEarned,
            accessor: 'commission_earned',
            render: value => (
              <div className='text-app-text-color'>
                <span className='text-app-success font-bold'>{thousandSeparatorComma(value)}</span>원
              </div>
            )
          },
          {
            key: 'adjustedCommission',
            header: lang?.common?.adjustedCommission,
            accessor: 'adjusted_commission',
            render: value => (
              <div className='text-app-text-color'>
                <span className='text-app-success font-bold'>{thousandSeparatorComma(value)}</span>원
              </div>
            )
          },
          {
            key: 'lastCommissionPaidAt',
            header: lang?.common?.lastCommissionPaid,
            accessor: 'last_commission_paid_at',
            render: value => (value ? format(new Date(value), 'yyyy-MM-dd | HH:mm') : '-')
          },
          {
            key: 'paidStatus',
            header: lang?.common?.paidStatus,
            accessor: 'paid_status',
            render: value => value ?? '-'
          }
        ]}
      />
    </>
  )
}
