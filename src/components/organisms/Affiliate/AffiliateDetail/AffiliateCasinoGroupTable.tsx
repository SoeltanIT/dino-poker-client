'use client'

import { GetData } from '@/@core/hooks/use-query'
import { DataTable } from '@/components/molecules/Table/DataTable'
import { LangProps } from '@/types/langProps'
import { ReferralGroupHistoryItem } from '@/types/referralDTO'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { useState } from 'react'

export interface AffiliateCasinoGroupTableProps {
  lang?: LangProps
}

export function AffiliateCasinoGroupTable({ lang }: AffiliateCasinoGroupTableProps) {
  const [page, setPage] = useState(1)
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

  const members = respReferralGroupHistory?.data || []
  const totalPage = respReferralGroupHistory?.totalPage || 0

  console.log(members)

  return (
    <>
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
    </>
  )
}
