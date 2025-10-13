'use client'

import { GetData } from '@/@core/hooks/use-query'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { DepositCryptoHistory, DepositWithdrawHistory } from '@/types/transaction'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import DetailTransactionHistory from './DetailTransactionHistory'
import { TransactionHistoryProps } from './types'

const typeOption = ['all', 'deposit', 'withdraw', 'adjustment']
const statusOptions = ['all', 'approved', 'pending', 'rejected']

const getStatusColor = (status: string) => {
  if (status === 'APPROVED' || status === 'COMPLETED') return 'font-medium text-[#23b682]'
  if (status === 'EXPIRED' || status === 'REJECTED') return 'font-medium text-app-danger'
  if (status === 'PENDING') return 'font-medium text-[#e2a129]'
  return 'text-app-text-color'
}

const getAmountColor = (type: string, status: string) => {
  // if (status === 'REJECTED') return 'text-app-text-color'
  if (type == 'DEPOSIT') return 'font-medium text-[#23b682]'
  if (type == 'deposit') return 'font-medium text-[#23b682]'
  if (type == 'adjustment_plus') return 'font-medium text-[#23b682]'
  if (type == 'adjustment_minus') return 'font-medium text-app-danger'
  if (type == 'withdraw') return ' font-medium text-app-danger'
  if (type == 'WITHDRAW') return ' font-medium text-app-danger'
  return ' font-medium text-[#e2a129]'
}

export default function TransactionHistoryPage({
  lang,
  locale,
  initialData,
  initialDataCrypto,
  initialPage,
  initialType,
  initialStatus,
  isInitialLoading
}: TransactionHistoryProps) {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()

  const [transactions, setTransactions] = useState<DepositWithdrawHistory[]>(initialData ?? [])
  const [transactionsCrypto, setTransactionsCrypto] = useState<DepositCryptoHistory[]>(initialDataCrypto ?? [])
  const [page, setPage] = useState(initialPage)
  const [totalPage, setTotalPage] = useState(1)
  const [pageCrypto, setPageCrypto] = useState(1)
  const [totalPageCrypto, setTotalPageCrypto] = useState(1)
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(initialType)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(initialStatus === 'all' ? 'all' : initialStatus)

  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const [selectedTrans, setSelectedTrans] = useState<DepositCryptoHistory | null>(null)
  const [openDetail, setOpenDetail] = useState(false)

  const type = selectedTypeFilter
  const status = selectedStatusFilter === 'all' ? '' : selectedStatusFilter

  const shouldFetch = page !== initialPage || type !== initialType || status !== initialStatus

  const [isLoading, setIsLoading] = useState(isInitialLoading || false)

  const tabs = [
    { name: 'FIAT', value: 'fiat' },
    { name: 'CRYPTO', value: 'crypto' }
  ]

  const [activeTab, setActiveTab] = useState<string>('fiat')
  // Fetch data using GetData
  const { data, isFetching } = GetData<{
    data: DepositWithdrawHistory[]
    totalPage: number
  }>(
    `/history_transaction/${type}`,
    ['getTransactionHistory', page, type, status], // You can still use this as queryKey cache
    true,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'POST', // method
    {
      page,
      pageSize: 10,
      type,
      status
    },
    'transaction'
  )

  // Fetch data using GetData
  const { data: respDepoCrypto, isFetching: isFetchDepoCrypto } = GetData<{
    data: DepositCryptoHistory[]
    totalPage: number
  }>(
    `/history_transaction_crypto`,
    ['getTransactionCrypto', pageCrypto], // You can still use this as queryKey cache
    true,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'POST', // method
    {
      page: pageCrypto,
      pageSize: 10
    },
    'transaction'
  )

  useEffect(() => {
    if (activeTab === 'fiat') {
      if (data?.data) {
        setTotalPage(data.totalPage)

        setTransactions(prev => {
          if (page === 1) {
            return data.data
          } else {
            // Prevent duplicates (optional but good practice)
            const existingIds = new Set(prev.map(item => item.id || `${item.created_at}-${item.amount}`))
            const newData = data.data.filter(item => !existingIds.has(item.id || `${item.created_at}-${item.amount}`))

            return [...prev, ...newData]
          }
        })

        setIsLoading(false)
      }
    } else {
      if (respDepoCrypto?.data) {
        setTotalPageCrypto(respDepoCrypto.totalPage)

        setTransactionsCrypto(prev => {
          if (pageCrypto === 1) {
            return respDepoCrypto.data
          } else {
            // Prevent duplicates (optional but good practice)
            const existingIds = new Set(
              prev.map(item => item.deposit_id || `${item.created_at}-${item.crypto_amount}-${item?.fiat_amount}`)
            )
            const newData = respDepoCrypto.data.filter(
              item =>
                !existingIds.has(item.deposit_id || `${item.created_at}-${item.crypto_amount}-${item?.fiat_amount}`)
            )

            return [...prev, ...newData]
          }
        })

        setIsLoading(false)
      }
    }
  }, [data, page, respDepoCrypto, pageCrypto, activeTab])

  // Reset page when filter changes
  useEffect(() => {
    setPage(1)
  }, [selectedTypeFilter, selectedStatusFilter])

  const handleLoadMore = () => {
    if (activeTab === 'fiat') {
      if (page < totalPage) {
        setPage(prev => prev + 1)
      }
    } else {
      if (pageCrypto < totalPageCrypto) {
        setPageCrypto(prev => prev + 1)
      }
    }
  }

  const handleContactSupport = (transaction: any) => {
    console.log('[LiveChat] handleContactSupport called.')

    if (!ready) {
      console.warn('[LiveChat] Widget is not ready yet. Aborting...')
      return
    }

    const widget = window.LiveChatWidget

    if (!widget || typeof widget.call !== 'function') {
      console.error('[LiveChat] LiveChatWidget is not available or malformed.')
      return
    }

    widget.call('set_session_variables', {
      userID: session?.user?.id,
      transactionID: transaction.id,
      amount: `KRW ${thousandSeparatorComma(transaction.amount)}`,
      type: transaction.type,
      dateTransaction: format(new Date(transaction.created_at), 'yyyy-MM-dd | HH:mm')
    })

    if (session?.user) {
      widget.call('set_customer_name', session.user.name ?? '')
      widget.call('set_customer_email', session.user.email ?? '')
    } else {
      //console.warn('[LiveChat] Session user not found. Skipping customer info.')
    }

    //console.log('[LiveChat] Maximizing chat widget...')
    widget.call('maximize')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'DEPOSIT':
        return lang?.common?.deposit || 'Deposit'
      case 'withdraw':
      case 'WITHDRAW':
        return lang?.common?.withdraw || 'Withdraw'
      case 'adjustment_minus':
      case 'adjustment':
        return lang?.common?.adjustmentMinus || 'Adjustment Minus'
      case 'ADJUSTMENT_PLUS':
      case 'adjustment_plus':
        return lang?.common?.adjustmentPlus || 'Adjustment Plus'
      default:
        return lang?.common?.all || 'All Types'
    }
  }

  const getStatusLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'approved':
        return lang?.common?.approved || 'Approved'
      case 'rejected':
        return lang?.common?.rejected || 'Rejected'
      case 'pending':
        return lang?.common?.pending || 'Pending'
      case 'expired':
        return lang?.common?.expired || 'Expired'
      case 'completed':
        return lang?.common?.completed || 'Completed'
      default:
        return lang?.common?.all || 'All'
    }
  }

  return (
    <div className='flex flex-col w-full min-h-screen text-app-text-color px-6 lg:px-16 my-10'>
      <div className='flex items-center mb-[36px]'>
        <div>
          <h1 className='text-3xl font-bold tracking-wide uppercase'>{lang?.common?.transactionHistory}</h1>
          {/* <span className='text-app-neutral500 text-sm'>{lang?.common?.descTransactionHistory}</span> */}
        </div>
      </div>

      {/* <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> */}

      {/* Mobile View */}
      {activeTab === 'fiat' && (
        <div className='flex md:hidden gap-3 pb-4 w-full'>
          {/* Type Filter */}
          <div className='flex-1'>
            <Select value={selectedTypeFilter} onValueChange={val => setSelectedTypeFilter(val)}>
              <SelectTrigger className='w-full bg-app-background-secondary border-border uppercase text-app-color'>
                <SelectValue placeholder={lang?.common?.selectTypes} />
              </SelectTrigger>
              <SelectContent className='bg-app-background-primary text-app-text-color border-border'>
                {typeOption.map(option => (
                  <SelectItem key={option} value={option} className='uppercase'>
                    {option === 'all' ? lang?.common?.all : getTypeLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className='flex-1'>
            <Select value={selectedStatusFilter} onValueChange={val => setSelectedStatusFilter(val)}>
              <SelectTrigger className='w-full bg-app-background-secondary border-border uppercase text-app-color'>
                <SelectValue placeholder={lang?.common?.selectStatus} />
              </SelectTrigger>
              <SelectContent className='bg-app-background-primary text-app-text-color border-border'>
                {statusOptions.map(option => (
                  <SelectItem key={option} value={option} className='uppercase'>
                    {option === 'all' ? lang?.common?.all : getStatusLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Filter Headers */}
      <div
        className={cn(
          'hidden items-center md:grid md:grid-cols-5 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase',
          activeTab === 'fiat' ? 'md:grid-cols-5' : 'md:grid-cols-6'
        )}
      >
        {activeTab === 'fiat' ? (
          <>
            <div>{lang?.common?.time}</div>
            {/* TYPE FILTER */}
            <div className='flex items-center gap-2'>
              <span>
                {lang?.common?.type} ({getTypeLabel(selectedTypeFilter)})
              </span>
              <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
                <PopoverTrigger asChild>
                  <button className='flex items-center justify-center hover:bg-app-white100 rounded-md p-1'>
                    <ChevronDown className='h-4 w-4 text-app-neutral500' />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-40 p-1 z-50 bg-app-background-primary text-app-text-color border border-gray-800'>
                  {typeOption.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedTypeFilter(option)
                        setIsTypeOpen(false) // ✅ Close on select
                      }}
                      className='w-full text-left px-3 py-2 text-xs hover:bg-app-neutral300 uppercase'
                    >
                      {getTypeLabel(option)}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div>{lang?.common?.currency}</div>
            <div>{lang?.common?.amount}</div>
            {/* STATUS FILTER */}
            <div className='flex items-center gap-2'>
              <span>
                {lang?.common?.status} ({getStatusLabel(selectedStatusFilter)})
              </span>
              <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                <PopoverTrigger asChild>
                  <button className='flex items-center justify-center hover:bg-app-white100 rounded-md p-1'>
                    <ChevronDown className='h-4 w-4 text-app-neutral500' />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-40 p-1 z-50 bg-app-background-primary text-app-text-color border border-gray-800'>
                  {statusOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedStatusFilter(option)
                        setIsStatusOpen(false) // ✅ Close on select
                      }}
                      className='w-full text-left px-3 py-2 text-xs hover:bg-app-neutral300 uppercase'
                    >
                      {getStatusLabel(option)}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </>
        ) : (
          <>
            <div>{lang?.common?.time}</div>
            <div>{lang?.common?.blockchain}</div>
            <div>{lang?.common?.token}</div>
            <div>{lang?.common?.cryptoAmount}</div>
            <div>{lang?.common?.fiatAmount}</div>
            <div>{lang?.common?.status}</div>
          </>
        )}
      </div>

      {/* List */}
      {activeTab === 'fiat' ? (
        <div className='space-y-1 bg-app-background-secondary rounded-[8px] border border-app-neutral600'>
          {isLoading ? (
            <div className='flex items-center justify-center py-24'>
              <Loader2 className='h-8 w-8 animate-spin text-app-primary' />
              <span className='ml-2 text-app-text-color'>{lang?.common?.loading}...</span>
            </div>
          ) : transactions?.length > 0 ? (
            transactions.map((transaction, index) => (
              <div key={index} className='p-4 rounded-[8px] transition-colors'>
                <div className='hidden md:grid md:grid-cols-5 gap-4 items-center'>
                  <div className='text-sm text-app-text-color'>
                    {format(new Date(transaction.created_at), 'yyyy-MM-dd | HH:mm')}
                  </div>
                  <div className='text-sm text-app-text-color uppercase'>{getTypeLabel(transaction.type)}</div>
                  <div className='text-sm text-app-neutral500'>KRW</div>
                  <div
                    className={`text-sm font-medium ${getAmountColor(
                      transaction.type,
                      transaction.review_status ?? ''
                    )}`}
                  >
                    {/* {transaction?.review_status === 'REJECTED' ? '' : transaction?.type === 'deposit' ? '+' : '-'} */}
                    {['deposit', 'adjustment_plus', 'DEPOSIT'].includes(String(transaction?.type)) ? '+' : '-'}
                    {thousandSeparatorComma(transaction.amount)}
                  </div>
                  <div className='flex items-center justify-between'>
                    {transaction.review_status && (
                      <span className={`text-sm uppercase ${getStatusColor(transaction.review_status)}`}>
                        {getStatusLabel(transaction.review_status)}
                      </span>
                    )}
                    {transaction.review_status === 'PENDING' && (
                      <Button
                        size='sm'
                        onClick={() => handleContactSupport(transaction)}
                        className='bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-3 py-1 text-xs uppercase'
                      >
                        {lang?.common?.contactUS}
                      </Button>
                    )}
                  </div>
                </div>

                <div className='md:hidden space-y-1'>
                  <div className='flex justify-between items-center'>
                    <div className='text-xs text-app-text-color'>
                      {format(new Date(transaction.created_at), 'yyyy-MM-dd | HH:mm')}
                    </div>
                    <span className={`text-xs uppercase ${getStatusColor(transaction.review_status ?? '')}`}>
                      {getStatusLabel(transaction.review_status || '')}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='w-[130px] text-sm font-semibold uppercase'>{getTypeLabel(transaction.type)}</div>
                    <div className='text-app-neutral500'>KRW</div>
                    <div
                      className={`w-[80px] flex text-sm font-medium justify-end ${getAmountColor(
                        transaction.type,
                        transaction.review_status ?? ''
                      )}`}
                    >
                      {/* {transaction?.review_status === 'REJECTED' ? '' : transaction?.type === 'deposit' ? '+' : '-'} */}
                      {['deposit', 'adjustment_plus', 'DEPOSIT'].includes(String(transaction?.type)) ? '+' : '-'}
                      {thousandSeparatorComma(transaction.amount)}
                    </div>
                  </div>

                  {transaction.review_status === 'PENDING' && (
                    <Button
                      size='sm'
                      onClick={() => handleContactSupport(transaction)}
                      className='w-full bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-2 py-1 !mt-2 text-xs uppercase'
                    >
                      {lang?.common?.contactUS}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Empty State */}
              <div className='flex flex-col items-center justify-center py-24 text-center bg-app-background-secondary rounded-md border border-app-neutral600 gap-4'>
                <Image
                  src={'/images/transactionNotFound.png'}
                  alt='Transaction Not Found'
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
      ) : (
        <div className='space-y-1 bg-app-background-secondary rounded-[8px] border border-app-neutral600'>
          {isLoading ? (
            <div className='flex items-center justify-center py-24'>
              <Loader2 className='h-8 w-8 animate-spin text-app-primary' />
              <span className='ml-2 text-app-text-color'>{lang?.common?.loading}...</span>
            </div>
          ) : transactionsCrypto?.length > 0 ? (
            transactionsCrypto.map((transaction, index) => (
              <div key={index} className='p-4 rounded-[8px] transition-colors'>
                <div className='hidden md:grid md:grid-cols-6 gap-4 items-center'>
                  <div className='text-sm text-app-text-color'>
                    {format(new Date(transaction?.created_at), 'yyyy-MM-dd | HH:mm')}
                  </div>
                  <div className='text-sm text-app-text-color uppercase'>{transaction?.blockchains ?? '-'}</div>
                  <div className='text-sm text-app-text-color uppercase'>{transaction?.token ?? '-'}</div>
                  <div className={`text-sm font-medium ${getStatusColor(transaction.status?.toUpperCase() ?? '')}`}>
                    {transaction?.crypto_amount}
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(transaction.status?.toUpperCase() ?? '')}`}>
                    {thousandSeparatorComma(transaction?.fiat_amount)}
                  </div>
                  <div className='flex items-center justify-between'>
                    {transaction.status && (
                      <span className={`text-sm uppercase ${getStatusColor(transaction.status?.toUpperCase())}`}>
                        {getStatusLabel(transaction.status?.toUpperCase())}
                      </span>
                    )}
                    {transaction?.status?.toUpperCase() === 'PENDING' && (
                      <Button
                        size='sm'
                        onClick={() => {
                          setSelectedTrans(transaction)
                          setOpenDetail(true)
                        }}
                        className='bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-3 py-1 text-xs uppercase'
                      >
                        {lang?.common?.detail}
                      </Button>
                    )}
                  </div>
                </div>

                <div className='md:hidden space-y-1'>
                  <div className='flex justify-between items-center'>
                    <div className='text-xs text-app-text-color'>
                      {format(new Date(transaction.created_at), 'yyyy-MM-dd | HH:mm')}
                    </div>
                    <span className={`text-xs uppercase ${getStatusColor(transaction.status?.toUpperCase() ?? '')}`}>
                      {getStatusLabel(transaction.status?.toUpperCase())}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='w-[130px] text-sm font-semibold uppercase'>
                      {transaction?.blockchains}-{transaction?.token}
                    </div>
                    <div className='text-app-neutral500'>KRW</div>
                    <div
                      className={`w-[80px] flex text-sm font-medium justify-end ${getStatusColor(
                        transaction?.status?.toUpperCase()
                      )}`}
                    >
                      {thousandSeparatorComma(transaction.fiat_amount)}
                    </div>
                  </div>

                  {transaction.status?.toUpperCase() === 'PENDING' && (
                    <Button
                      size='sm'
                      onClick={() => {
                        setSelectedTrans(transaction)
                        setOpenDetail(true)
                      }}
                      className='w-full bg-app-bg-primary-button border-app-primary border-[1px] hover:bg-app-primary-hover text-white px-2 py-1 !mt-2 text-xs uppercase'
                    >
                      {lang?.common?.detail}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Empty State */}
              <div className='flex flex-col items-center justify-center py-24 text-center bg-app-background-secondary rounded-md border border-app-neutral600 gap-4'>
                <Image
                  src={'/images/transactionNotFound.png'}
                  alt='Transaction Not Found'
                  width={1000}
                  height={1000}
                  className='h-[100px] w-[100px] object-contain object-center'
                />
                <span className='text-app-text-color text-sm'>{lang?.common?.noHistoryFound}</span>
              </div>
            </>
          )}

          {/* Load More */}
          {pageCrypto < totalPageCrypto && (
            <div className='flex justify-center py-4'>
              <Button disabled={isFetchDepoCrypto} onClick={handleLoadMore}>
                {isFetchDepoCrypto ? `${lang?.common?.loading}...` : lang?.common?.loadMore}
              </Button>
            </div>
          )}
        </div>
      )}
      {selectedTrans && (
        <DetailTransactionHistory
          lang={lang}
          detail={selectedTrans}
          open={openDetail}
          setOpen={setOpenDetail}
          locale={locale}
        />
      )}
    </div>
  )
}
