'use client'

import { GetData } from '@/@core/hooks/use-query'
import { IconDPUniversal, IconTicket } from '@/components/atoms/Icons'
import MyQRCode from '@/components/molecules/QRCode'
import CryptoDepositSkeleton from '@/components/molecules/Skeleton/CryptoSkeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/utils/helper/copyToClipboard'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { toPng } from 'html-to-image'
import { Copy } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { DetailTransactionHistoryProps } from './types'

const getTextColor = (status?: string) => {
  if (status === 'approved' || status === 'completed') return 'text-app-success'
  if (status === 'rejected' || status === 'expired') return 'text-app-danger'
  if (status === 'pending') return 'text-app-accentYellow'
  return 'text-app-text-color'
}

export default function DetailTransactionHistory({
  lang,
  detail,
  open,
  setOpen,
  locale
}: DetailTransactionHistoryProps) {
  const getStatusLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
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

  // const [open, setOpen] = useState(false)
  const CAMOPAY_URL = process.env.NEXT_PUBLIC_CAMOPAY_URL
  const CAMOPAY_KEY = process.env.NEXT_PUBLIC_CAMOPAY_KEY
  const { theme, toggleTheme } = useThemeToggle()

  const { data: respDetailCrypto, isFetching: isFetchDetailCrypto } = GetData<any>(
    '/detail_transaction_crypto',
    ['detail_trans_crypto', detail?.id], // <-- important
    false, // skipAuth
    undefined, // initialData
    Boolean(open && detail?.id), // <-- enabled
    undefined,
    undefined,
    undefined,
    'POST',
    { id: detail?.id },
    'transaction'
  )

  // Build URL only when data exists
  const CAMOPAY_FULL_URL = useMemo(() => {
    if (!respDetailCrypto?.external_deposit_id) return undefined
    return `${CAMOPAY_URL}/${locale || 'ko'}/payment/integration/${
      respDetailCrypto.external_deposit_id
    }?apiKey=${CAMOPAY_KEY}&theme=${theme}`
  }, [respDetailCrypto?.external_deposit_id, CAMOPAY_URL, CAMOPAY_KEY, locale, theme])

  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownloadQRCode = () => {
    if (!qrRef.current) {
      return
    }

    toPng(qrRef.current, { cacheBust: true, backgroundColor: '#fff' })
      .then(dataUrl => {
        const link = document.createElement('a')
        link.download = 'qr-code.png'
        link.href = dataUrl
        link.click()
      })
      .catch(err => {
        console.error('Error downloading QR Code:', err)
      })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        {/* Header */}
        <div className='flex items-center justify-between mt-6 mb-2'>
          <h1 className='text-xl uppercase font-bold text-app-text-color tracking-wide'>
            {lang?.common?.detailCryptoTransaction}
          </h1>
        </div>

        {/* ID */}
        <div className='mb-6'>
          <p className='text-sm text-app-text-color'>ID: {detail?.id}</p>
        </div>
        {isFetchDetailCrypto ? (
          <CryptoDepositSkeleton activeTab={'crypto'} />
        ) : (
          <>
            {respDetailCrypto?.promotion?.name !== '' && (
              <div className='mb-6'>
                <div className='space-y-4'>
                  <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                    <div className='flex flex-row items-center gap-2 mb-1'>
                      <IconTicket className='text-app-neutral500' />
                      <p className='text-sm text-app-neutral500'>{lang?.common?.appliedPromotion}</p>
                    </div>
                    <p className='text-app-text-color text-sm'>
                      {respDetailCrypto?.promotion?.name !== '' ? respDetailCrypto?.promotion?.name : '-'}
                    </p>
                  </div>

                  <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                    <div className='flex flex-row items-center gap-2 mb-1'>
                      <IconDPUniversal className='text-app-neutral500' />
                      <p className='text-sm text-app-neutral500'>{lang?.common?.minimalDeposit}</p>
                    </div>
                    <p className='text-app-text-color text-sm'>
                      ₩{thousandSeparatorComma(respDetailCrypto?.promotion?.min_deposit ?? '0')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='mb-8'>
              <div className='space-y-4'>
                {/* <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.blockchain}</p>
              <p className='text-app-text-color font-medium'>{detail?.blockchains ?? '-'}</p>
            </div>

            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.token}</p>
              <p className='text-app-text-color font-medium'>{detail?.token ?? '-'}</p>
            </div>

            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.cryptoAmount}</p>
              <p className='text-app-text-color font-medium'>{detail?.crypto_amount}</p>
            </div>

            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.fiatAmount}</p>
              <p className='text-app-text-color font-medium'>{detail?.fiat_amount}</p>
            </div> */}

                {/* <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.paymentTime}</p>
              <p className='text-app-text-color font-medium'>
                <CountdownTimerCrypto expiresAt={detail?.expires_at || ''} />
              </p>
            </div> */}

                <>
                  <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.qrCode}</p>
                  <div className='flex flex-col items-center justify-center gap-4 mb-[30px] mt-6'>
                    <MyQRCode ref={qrRef} value={detail?.wallet_address || ''} />
                    <Button
                      onClick={handleDownloadQRCode}
                      variant={'outline'}
                      className='min-w-[130px] text-app-text-color text-xs font-medium rounded-lg uppercase transition-colors bg-transparent p-4'
                    >
                      {lang?.common?.downloadQRCode}
                    </Button>
                  </div>
                  <div className='flex flex-col mb-6'>
                    <div className='flex flex-row items-center text-app-text-color gap-2'>
                      <span className='text-app-neutral500 text-sm'>{lang?.common?.depositAddress}</span>
                      <Copy
                        className='h-4 w-4 cursor-pointer hover:text-app-neutral100 transition-colors'
                        onClick={() => copyToClipboard(detail?.wallet_address || '', lang)}
                      />
                    </div>

                    <div className='text-app-text-color whitespace-normal break-words font-medium mt-2'>
                      {detail?.wallet_address || '-'}
                    </div>
                  </div>
                </>
                <div>
                  <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.status}</p>
                  <p className={cn('font-medium uppercase', getTextColor(detail?.status))}>
                    {getStatusLabel(detail?.status)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* {CAMOPAY_FULL_URL && (
          <iframe
            key={respDetailCrypto?.external_deposit_id}
            src={CAMOPAY_FULL_URL}
            width='100%'
            height='100%'
            className='mb-8 rounded-lg min-h-screen'
            frameBorder='0'
          />
        )} */}
      </SheetContent>
    </Sheet>
  )
}
