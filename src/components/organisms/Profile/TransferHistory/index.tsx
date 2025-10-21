'use client'

import { GetData } from '@/@core/hooks/use-query'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DepositCryptoHistory } from '@/types/transaction'
import { TransferHistoryItem } from '@/utils/api/internal/transferHistory'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { TransactionHistoryProps } from './types'

const typeOption = ['all', 'deposit', 'withdraw', 'adjustment']
const statusOptions = ['all', 'approved', 'pending', 'rejected']

const getStatusColor = (status: string) => {
  const normalized = status.toUpperCase()

  const green = 'font-medium text-app-success'
  const red = 'font-medium text-app-danger'
  const yellow = 'font-medium text-app-warning'
  const neutral = 'text-app-text-color'

  switch (normalized) {
    case 'APPROVED':
    case 'COMPLETED':
      return green
    case 'EXPIRED':
    case 'REJECTED':
      return red
    case 'PENDING':
      return yellow
    default:
      return neutral
  }
}

const getAmountColor = (type: string) => {
  const normalizedType = type.toLowerCase()

  const green = 'font-medium text-app-success'
  const red = 'font-medium text-app-danger'
  const yellow = 'font-medium text-app-warning'

  // Optionally handle rejected case
  // if (status === 'REJECTED') return 'text-app-text-color'

  switch (normalizedType) {
    case 'deposit':
    case 'adjustment_plus':
      return green
    case 'withdraw':
    case 'adjustment_minus':
      return red
    default:
      return yellow
  }
}

export default function TransactionHistoryPage({
  lang,
  locale,
  initialData,
  initialPage,
  // initialType,
  // initialStatus,
  isInitialLoading
}: TransactionHistoryProps) {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()

  const [transfers, setTransfers] = useState<TransferHistoryItem[]>(initialData ?? [])
  // const [transfersCrypto, setTransfersCrypto] = useState<DepositCryptoHistory[]>(initialDataCrypto ?? [])
  const [page, setPage] = useState(initialPage)
  const [totalPage, setTotalPage] = useState(1)
  const [pageCrypto, setPageCrypto] = useState(1)
  const [totalPageCrypto, setTotalPageCrypto] = useState(1)
  // const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(initialType)
  // const [selectedStatusFilter, setSelectedStatusFilter] = useState(initialStatus === 'all' ? 'all' : initialStatus)

  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const [selectedTrans, setSelectedTrans] = useState<DepositCryptoHistory | null>(null)
  const [openDetail, setOpenDetail] = useState(false)

  // const type = selectedTypeFilter
  // const status = selectedStatusFilter === 'all' ? '' : selectedStatusFilter

  // const shouldFetch = page !== initialPage || type !== initialType || status !== initialStatus

  const [isLoading, setIsLoading] = useState(isInitialLoading || false)

  const tabs = [
    { name: 'FIAT', value: 'fiat' },
    { name: 'CRYPTO', value: 'crypto' }
  ]

  const [activeTab, setActiveTab] = useState<string>('fiat')
  // Fetch data using GetData
  const { data, isFetching } = GetData<{
    data: TransferHistoryItem[]
    totalPage: number
  }>(
    `/transfer_history`,
    ['getTransferHistory', page], // You can still use this as queryKey cache
    true,
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
    'transaction'
  )

  // Fetch data using GetData
  // const { data: respDepoCrypto, isFetching: isFetchDepoCrypto } = GetData<{
  //   data: DepositCryptoHistory[]
  //   totalPage: number
  // }>(
  //   `/history_transaction_crypto`,
  //   ['getTransactionCrypto', pageCrypto], // You can still use this as queryKey cache
  //   true,
  //   undefined,
  //   true,
  //   undefined,
  //   undefined,
  //   undefined,
  //   'POST', // method
  //   {
  //     page: pageCrypto,
  //     pageSize: 10
  //   },
  //   'transaction'
  // )

  useEffect(() => {
    if (data?.data) {
      setTotalPage(data.totalPage)

      setTransfers(prev => {
        if (page === 1) {
          return data.data
        } else {
          // Prevent duplicates (optional but good practice)
          const existingIds = new Set(prev.map(item => item.userId || `${item.createdAt}-${item.amount}`))
          const newData = data.data.filter(item => !existingIds.has(item.userId || `${item.createdAt}-${item.amount}`))

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
      case 'ADJUSTMENT_MINUS':
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
          <h1 className='text-3xl font-bold tracking-wide uppercase'>{lang?.common?.transferHistory}</h1>
          {/* <span className='text-app-neutral500 text-sm'>{lang?.common?.descTransactionHistory}</span> */}
        </div>
      </div>

      {/* <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> */}

      {/* Filter Headers */}
      <div
        className={cn(
          'hidden items-center md:grid md:grid-cols-5 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase'
        )}
      >
        <>
          <div>{lang?.common?.date}</div>
          <div>{lang?.common?.type}</div>
          <div>{lang?.common?.amount}</div>
          <div>{lang?.common?.rate}</div>
          <div>{lang?.common?.chipAmount}</div>
        </>
      </div>

      {/* List */}
      <div className='space-y-1 bg-app-background-primary rounded-[8px] border border-app-neutral300'>
        {isLoading ? (
          <div className='flex items-center justify-center py-24'>
            <Loader2 className='h-8 w-8 animate-spin text-app-primary' />
            <span className='ml-2 text-app-text-color'>{lang?.common?.loading}...</span>
          </div>
        ) : transfers?.length > 0 ? (
          transfers.map((item, index) => {
            let chipCalculation = item.rate !== 0 ? item.amount * item.rate : item.amount * 11
            return (
              <div key={index} className='p-4 rounded-[8px] transition-colors'>
                <div className='hidden md:grid md:grid-cols-5 gap-4 items-center'>
                  <div className='text-sm text-app-neutral500'>
                    {format(new Date(item.createdAt), 'yyyy-MM-dd | HH:mm')}
                  </div>
                  <div className='text-sm text-app-neutral500'>{item?.type}</div>
                  <div className='text-sm text-app-neutral500'>{thousandSeparatorComma(item?.amount)}</div>
                  <div className='text-sm text-app-neutral500'>{item?.rate}</div>
                  <div className='text-sm text-app-text-color font-medium'>
                    {thousandSeparatorComma(chipCalculation)}
                  </div>
                </div>

                <div className='md:hidden space-y-1'>
                  <div className='flex justify-between items-center'>
                    <div className='text-xs text-app-text-color'>
                      {format(new Date(item?.createdAt), 'yyyy-MM-dd | HH:mm')}
                    </div>
                    <span className={`text-xs uppercase text-app-neutral500`}>{item?.type}</span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='w-[130px] text-xs uppercase text-app-neutral500'>
                      KRW {thousandSeparatorComma(item?.amount)}
                    </div>
                    <div className='text-xs text-app-neutral500'>Rate: {item?.rate ?? 11}</div>
                    <div className={`w-[80px] flex text-sm font-medium justify-end `}>
                      {thousandSeparatorComma(chipCalculation)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <>
            {/* Empty State */}
            <div className='flex flex-col items-center justify-center py-24 text-center gap-4'>
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

      {/* {selectedTrans && (
        <DetailTransactionHistory
          lang={lang}
          detail={selectedTrans}
          open={openDetail}
          setOpen={setOpenDetail}
          locale={locale}
        />
      )} */}
    </div>
  )
}
