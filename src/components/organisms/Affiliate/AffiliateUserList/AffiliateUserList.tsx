'use client'

import { LoadingTable, LoadingText } from '@/components/atoms/Loading'
import { Button } from '@/components/ui/button'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { AffiliateUserListResponse } from '@/types/referralDTO'
import { useAffiliateUserList } from '@/utils/api/internal/getAffiliateUserList'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export interface AffiliateUserListProps {
  lang: LangProps
  locale?: Locale
  initialAffiliateUserData?: AffiliateUserListResponse | null
}

export function AffiliateUserList({ lang, locale, initialAffiliateUserData }: AffiliateUserListProps) {
  const [page, setPage] = useState(1)
  const [dataList, setDataList] = useState<AffiliateUserListResponse['data'] | null>(
    initialAffiliateUserData?.data || null
  )

  const { data: session, status } = useSession()

  const userId = session?.user?.id

  // Use client-side hooks for data fetching with server-side initial data
  // Only use initialData for page 1, otherwise undefined to force fetch
  const { data: respAffiliateUserList, isFetching: isFetchingAffiliateUserList } = useAffiliateUserList(
    userId,
    {
      page: page,
      pageSize: 10
    },
    page === 1 ? initialAffiliateUserData : undefined
  )
  const isLoading = isFetchingAffiliateUserList
  const totalPage = (respAffiliateUserList?.pagination?.total ?? 0) / 10

  useEffect(() => {
    if (respAffiliateUserList) {
      setDataList(prev => {
        if (page === 1) {
          return respAffiliateUserList?.data
        } else {
          // Check for duplicates before appending
          const existingIds = new Set(prev?.map(a => `${a.id}`))
          const newData = respAffiliateUserList?.data.filter(a => !existingIds.has(`${a.id}`))
          return [...(prev || []), ...newData]
        }
      })
    }
  }, [respAffiliateUserList, page])

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }
  return (
    <div className='lg:flex lg:gap-8'>
      {/* Settings List */}
      <div className='flex-1'>
        {/* Mobile Settings List */}
        <div className='lg:hidden'>
          {dataList && dataList?.length > 0 ? (
            <div className='space-y-3'>
              {dataList.map((affiliate, index) => (
                <div
                  className='bg-app-background-secondary rounded-lg p-4 border border-gray-800 space-y-2'
                  key={index}
                >
                  <div className='flex justify-between items-center'>
                    <div className='text-app-neutral500 text-sm'>{lang?.common?.codeName}</div>
                    <div className='text-app-neutral500 text-sm'>{affiliate.code_name}</div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='text-app-neutral500 text-sm'>{lang?.common?.username}</div>
                    <div className='text-sm'>{affiliate.username}</div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='text-app-neutral500 text-sm'>{lang?.common?.commission}</div>
                    <div className='text-app-success font-bold text-sm'>{affiliate.commission}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className='p-8 text-center flex flex-col gap-3 items-center'>
                <Image
                  src={'/images/betNotFound.png'}
                  alt='Bet Not Found'
                  width={1000}
                  height={1000}
                  className='h-[100px] w-[100px] object-contain object-center'
                />
                <p className='text-gray-300'>{lang?.common?.noAffiliate}.</p>
              </div>
            </>
          )}
          {isLoading && <LoadingText lines={3} />}
        </div>

        {/* Desktop Table */}
        <div className='hidden lg:block'>
          <div className='overflow-hidden'>
            <div className='hidden items-center md:grid md:grid-cols-3 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase'>
              <div>{lang?.common?.codeName}</div>
              <div>{lang?.common?.username}</div>
              <div>{lang?.common?.commission}</div>
            </div>

            <div className='rounded-lg bg-app-background-secondary border border-app-neutral600'>
              {dataList && dataList?.length > 0 ? (
                dataList.map((affiliate, index) => (
                  <div key={index} className='grid grid-cols-3 gap-4 p-4 last:border-b-0'>
                    <div className='text-app-text-color'>{affiliate.code_name}</div>
                    <div className='text-app-text-color'>{affiliate.username}</div>
                    <div className='text-app-text-color'>{affiliate.commission}</div>
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
                  <p className='text-gray-300'>{lang?.common?.noAffiliate}.</p>
                </div>
              )}
              {isLoading && <LoadingTable columns={3} rows={1} showHeader={false} />}
            </div>
          </div>
        </div>

        {/* Load More */}
        {page < totalPage && (
          <div className='flex justify-center py-4'>
            <Button disabled={isLoading} onClick={handleLoadMore}>
              {isLoading ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
