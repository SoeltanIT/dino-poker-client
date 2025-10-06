'use client'

import { GetData } from '@/@core/hooks/use-query'
import { Button } from '@/components/ui/button'
import { PokerHistoryDTO } from '@/types/pokerHistory'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { Gift, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PokerHistoryProps } from './types'
import { useRakeBackSummary } from '@/utils/api/internal/getRakeBackSummary'
import { claimRakeBack, useClaimRakeBack } from '@/utils/api/internal/claimRakeBack'

const currencyOptions = ['Fiat', 'Crypto']

const getStatusColor = (status: string) => {
  if (status === 'APPROVED') return 'text-app-success'
  if (status === 'REJECTED') return 'text-app-danger'
  if (status === 'PENDING') return 'text-app-accentYellow'
  return 'text-app-text-color'
}

const getTextColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'win':
      return 'text-app-success'
    case 'lose':
      return 'text-app-danger'
    case 'pending':
      return 'text-app-accentYellow'
    default:
      return 'text-app-text-color'
  }
}

export default function BetHistoryPage({
  lang,
  locale,
  initialPage,
  initialSummaryData,
  initialData,
  isInitialLoading,
  initialTotalPage
}: PokerHistoryProps) {
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'win':
        return lang?.common?.won || 'Won'
      case 'lose':
        return lang?.common?.lost || 'Lost'
      case 'pending':
        return lang?.common?.pending || 'Pending'
      default:
        return '-'
    }
  }

  const [betHistory, setBetHistory] = useState<PokerHistoryDTO[]>(initialData?.data || [])
  const [page, setPage] = useState(initialPage || 1)
  const [totalPage, setTotalPage] = useState(initialTotalPage || 1)
  const [isLoading, setIsLoading] = useState(isInitialLoading || false)

  const [selectedBet, setSelectedBet] = useState<PokerHistoryDTO | null>(null)
  const [openDetail, setOpenDetail] = useState(false)

  const shouldFetch = page !== initialPage

  // Fetch data using GetData
  const { data, isFetching, refetch } = GetData<{ data: PokerHistoryDTO[]; totalPage: number }>(
    `/poker_history`,
    ['getPokerHistory', page],
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
    'transaction'
  )

  const { claimRakeBack, isLoading: isClaiming } = useClaimRakeBack(lang)

  const {
    data: rakeBackSummaryData,
    isLoading: clientSummaryLoading,
    error: summaryError
  } = useRakeBackSummary(initialSummaryData || undefined)

  const summaryData = rakeBackSummaryData || initialSummaryData

  useEffect(() => {
    if (data) {
      setTotalPage(data.totalPage)

      setBetHistory(prev => {
        if (page === 1) {
          return data.data
        } else {
          // Check for duplicates before appending
          const existingIds = new Set(prev.map(bet => `${bet.created_at}-${bet.amount}`))
          const newData = data.data.filter(bet => !existingIds.has(`${bet.created_at}-${bet.amount}`))
          return [...prev, ...newData]
        }
      })

      setIsLoading(false)
    }
  }, [data, page])

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  const showLoading = (isInitialLoading && page === 1) || (isFetching && page === 1)

  return (
    <div className='flex flex-col w-full min-h-screen text-app-text-color px-6 lg:px-16 my-10'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center md:mb-[36px]'>
        <div className='mb-6 md:mb-0'>
          <h1 className='text-3xl font-bold tracking-wide uppercase'>{lang?.common?.betHistory}</h1>
          {/* <p className='text-app-neutral500 text-sm'>{lang?.common?.descBetHistory}</p> */}
        </div>

        {/* <div className="flex flex-col">
          <label className="text-app-text-color text-sm mb-2 block">
            Select Fiat / Crypto
          </label>
          <div className="relative" ref={currencyDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="w-full md:w-64 bg-app-white100 text-app-text-color placeholder-app-neutral500 h-10 px-3 rounded-md flex items-center justify-between transition-colors"
            >
              <span
                className={
                  selectedCurrency ? "text-app-text-color" : "text-app-neutral500"
                }
              >
                {selectedCurrency || "Select"}
              </span>
              <ChevronDown className="h-4 w-4 text-app-neutral500" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-app-background-primary rounded-md shadow-lg z-10 border border-app-neutral600">
                {currencyOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(option);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-app-text-color hover:bg-gray-700 transition-colors first:rounded-t-md last:rounded-b-md"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>

      <div className='lg:flex lg:gap-8'>
        {/* Summary Stats */}
        <div className='hidden md:block lg:w-64 mb-8 lg:mb-0'>
          <div className='gap-4 flex flex-row lg:flex-col w-full'>
            <div className=' bg-app-background-secondary rounded-lg p-4 w-full'>
              <div className='text-app-neutral500 text-sm mb-2'>{lang?.common?.rakeBackBonus || 'Rake Back Bonus'}</div>
              <div className='text-app-neutral500 text-xs mb-3'>
                <p className='text-2xl font-bold text-app-text-color'>
                  KRW
                  <span className='text-app-success'>{` ${summaryData?.data?.total_unclaimed.toLocaleString()}`}</span>
                </p>
              </div>
              <Button
                onClick={async () => {
                  try {
                    await claimRakeBack({ url: '/rakeback-claim', body: {} })
                  } catch (error) {
                    console.error('Failed to claim referral:', error)
                  }
                }}
                disabled={isClaiming || summaryData?.data?.total_unclaimed === 0}
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
                    {lang?.common?.claimBonus || 'Claim Bonus'}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className='mb-4 md:hidden'>
          <div className='bg-app-background-secondary rounded-lg p-4 mb-3'>
            <div className='text-app-neutral500 text-sm mb-2'>
              {lang?.common?.claimRakeBackBonus || 'Claim Rake Back Bonus'}
            </div>
            <p className='text-2xl font-bold text-app-text-color'>
              KRW
              <span className='text-app-success'>{` ${summaryData?.data?.total_unclaimed.toLocaleString()}`}</span>
            </p>
          </div>
          <Button
            onClick={async () => {
              try {
                await claimRakeBack({ url: '/rakeback-claim', body: {} })
              } catch (error) {
                console.error('Failed to claim rack back bonus:', error)
              }
            }}
            disabled={isClaiming || summaryData?.data?.total_unclaimed === 0}
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
                {lang?.common?.claimBonus || 'Claim Referral'}
              </div>
            )}
          </Button>
        </div>

        {/* Table & Empty State */}
        <div className='overflow-hidden flex flex-col flex-1'>
          {/* Table Header */}
          <div className='hidden items-center md:grid md:grid-cols-4 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase'>
            <div>{lang?.common?.time}</div>
            <div>{lang?.common?.gameName}</div>
            <div>{lang?.common?.amount}</div>
            <div>{lang?.common?.status}</div>
          </div>

          <div className='space-y-1 bg-app-background-secondary rounded-[8px] border border-app-neutral600'>
            {isLoading ? (
              <div className='flex items-center justify-center py-24'>
                <Loader2 className='h-8 w-8 animate-spin text-app-primary' />
                <span className='ml-2 text-app-text-color'>{lang?.common?.loading}...</span>
              </div>
            ) : betHistory?.length > 0 ? (
              betHistory.map((bet, index) => {
                let betStatus = bet.status.toLowerCase()
                return (
                  <div key={index} className='p-4 rounded-[8px] transition-colors'>
                    <div className='hidden md:grid md:grid-cols-4 gap-4 items-center'>
                      <div className='text-sm text-app-text-color'>
                        {format(new Date(bet.created_at), 'yyyy-MM-dd | HH:mm')}
                      </div>
                      <div className='text-sm text-app-text-color uppercase'>{bet.game_name}</div>
                      <div className={`text-sm font-medium ${getTextColor(bet.status)}`}>
                        <span className='text-app-neutral500'>KRW </span>
                        {betStatus === 'win' ? '+' : betStatus === 'pending' ? '' : bet.amount != 0 ? '-' : ''}
                        {thousandSeparatorComma(Math.floor(bet.amount))}
                      </div>
                      <div className='flex justify-between items-center'>
                        <div className={`text-sm ${getTextColor(bet.status)} uppercase`}>
                          {getStatusLabel(bet.status)}
                        </div>
                        {/* <Button
                      size='sm'
                      // onClick={() => {
                      //   setSelectedBet(bet)
                      //   setOpenDetail(true)
                      // }}
                      className='flex bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-4 py-1 !mt-2 text-xs uppercase'
                    >
                      {lang?.common?.detail}
                    </Button> */}
                      </div>
                    </div>

                    <div className='md:hidden space-y-1'>
                      <div className='flex justify-between items-center'>
                        <div className='text-xs text-app-text-color'>
                          {format(new Date(bet.created_at), 'yyyy-MM-dd | HH:mm')}
                        </div>
                        <span className={`text-xs`}>{bet.game_name}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <div className={`w-full flex text-sm font-medium ${getTextColor(bet.status)}`}>
                          {betStatus === 'win' ? '+' : betStatus === 'pending' ? '' : bet.amount != 0 ? '-' : ''}
                          {thousandSeparatorComma(Math.floor(bet.amount))} KRW
                        </div>
                        <div
                          className={`flex w-[100px] text-sm font-semibold uppercase justify-end ${getTextColor(
                            bet.status
                          )}`}
                        >
                          {getStatusLabel(bet.status)}
                        </div>
                      </div>

                      {/* <Button
                    size='sm'
                    // onClick={() => {
                    //   setSelectedBet(bet)
                    //   setOpenDetail(true)
                    // }}
                    className='flex w-full md:w-[50%] bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-2 py-1 !mt-2 text-xs uppercase'
                  >
                    {lang?.common?.detail}
                  </Button> */}
                    </div>
                  </div>
                )
              })
            ) : (
              <>
                {/* Empty State */}
                <div className='flex flex-col items-center justify-center py-24 text-center bg-app-background-secondary rounded-md border border-app-neutral600 gap-4'>
                  <Image
                    src={'/images/betNotFound.png'}
                    alt='Bet Not Found'
                    width={1000}
                    height={1000}
                    className='h-[100px] w-[100px] object-contain object-center'
                  />
                  <span className='text-app-text-color text-sm'>{lang?.common?.noHistoryFound}</span>
                </div>
              </>
            )}

            {/* Load More */}
            {page < totalPage && (
              <div className='flex justify-center py-4'>
                <Button disabled={isFetching} onClick={handleLoadMore}>
                  {isFetching ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <DetailBetHistory lang={lang} detail={selectedBet} open={openDetail} setOpen={setOpenDetail} /> */}
    </div>
  )
}
