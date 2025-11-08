'use client'

import { GetData } from '@/@core/hooks/use-query'
import { IconDPUniversal, IconTicket } from '@/components/atoms/Icons'
import MyQRCode from '@/components/molecules/QRCode'
import CryptoDepositSkeleton from '@/components/molecules/Skeleton/CryptoSkeleton'
import { Button } from '@/components/ui/button'
import { ConfigItem } from '@/types/config'
import { copyToClipboard } from '@/utils/helper/copyToClipboard'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { getLinkTranscationHistory } from '@/utils/linkFactory/linkFactory'
import { toPng } from 'html-to-image'
import { Copy } from 'lucide-react'
import { useRef } from 'react'
import { useLiveChat } from '../hooks/useLiveChat'
import { DepositConfirmFormProps, DepositDataProps } from '../types'

export default function DepositConfirmForm({
  lang,
  data,
  locale,
  onClose,
  activeTab,
  configData
}: DepositConfirmFormProps) {
  const CAMOPAY_URL = process.env.NEXT_PUBLIC_CAMOPAY_URL
  const CAMOPAY_KEY = process.env.NEXT_PUBLIC_CAMOPAY_KEY
  const { theme, toggleTheme } = useThemeToggle()
  const { openLiveChatWithTransaction } = useLiveChat()

  function getValueByKey(config: ConfigItem[], key: string): string | undefined {
    return config.find(item => item.key === key)?.value
  }

  const { data: respDetailCrypto, isFetching: isFetchDetailCrypto } = GetData<any>(
    '/detail_transaction_crypto',
    ['detail_trans_crypto', data?.deposit_id], // <-- important
    false, // skipAuth
    undefined, // initialData
    Boolean(activeTab === 'crypto' && data && data?.deposit_id), // <-- enabled
    undefined,
    undefined,
    undefined,
    'POST',
    { id: data?.deposit_id },
    'transaction'
  )

  console?.log('data detail >', respDetailCrypto)

  const handleContactSupport = (transaction: DepositDataProps) => {
    onClose()
    openLiveChatWithTransaction(transaction)
  }

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

  if (isFetchDetailCrypto) {
    return <CryptoDepositSkeleton activeTab={activeTab} />
  }

  return (
    <>
      <div className='mb-5'>
        <p className='text-app-text-color text-xl font-bold uppercase'>
          {activeTab !== 'crypto' ? lang?.common?.waitingPayment : lang?.common?.cryptoDeposit}
        </p>
      </div>

      {/* Payment Time */}
      {/* {activeTab !== 'crypto' && (
        <div className='flex items-center gap-[10px] mb-[30px]'>
          <span className='text-sm text-app-text-color'>{lang?.common?.paymentTime}:</span>
          <div className='flex items-center justify-center bg-app-primary min-w-[120px] h-[30px] rounded-2xl text-white'>
            {/* {activeTab === 'crypto' ? <CountdownTimerCrypto expiresAt={data?.expired_at || ''} /> : <CountdownTimer />} */}
      {/* {<CountdownTimer />}
          </div>
        </div>
      )} */}

      {/* Content + QR (flex-grow zone) */}
      <div className='flex flex-col flex-grow'>
        {activeTab !== 'crypto' && (
          <div className='flex flex-col w-full max-h-[90px] bg-app-background-secondary rounded-[16px] items-center justify-center gap-[3px] py-4 '>
            <span className='text-xs text-app-neutral500'>{lang?.common?.totalPayment}</span>
            <span className='text-[32px] text-app-text-color'>{thousandSeparatorComma(data?.amount || 0)}원</span>
          </div>
        )}

        {activeTab !== 'crypto' && (
          <span className='text-sm text-app-danger mb-[30px] mt-2'>
            {configData ?? lang?.common?.depositAccountMsg}
          </span>
        )}

        {activeTab === 'crypto' && (
          <>
            {data?.promotion?.name !== '' && (
              <div className='mb-6'>
                <div className='space-y-4'>
                  <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                    <div className='flex flex-row items-center gap-2 mb-1'>
                      <IconTicket className='text-app-neutral500' />
                      <p className='text-sm text-app-neutral500'>{lang?.common?.appliedPromotion}</p>
                    </div>
                    <p className='text-app-text-color text-sm'>
                      {data?.promotion?.name !== '' ? data?.promotion?.name : '-'}
                    </p>
                  </div>

                  <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                    <div className='flex flex-row items-center gap-2 mb-1'>
                      <IconDPUniversal className='text-app-neutral500' />
                      <p className='text-sm text-app-neutral500'>{lang?.common?.minimalDeposit}</p>
                    </div>
                    <p className='text-app-text-color text-sm'>
                      {thousandSeparatorComma(data?.promotion?.min_deposit ?? '0')}원
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className='flex flex-col items-center justify-center gap-4 mb-[30px] mt-6'>
              <MyQRCode ref={qrRef} value={data?.wallet_address || ''} />
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
                <span className='text-app-text-color text-sm'>{lang?.common?.depositAddress}</span>
                <Copy
                  className='h-4 w-4 cursor-pointer hover:text-app-neutral100 transition-colors'
                  onClick={() => copyToClipboard(data?.wallet_address || '', lang)}
                />
              </div>

              <div className='bg-app-white100 text-sm break-words whitespace-normal mt-2 rounded-lg py-2 px-3 text-app-text-color'>
                {data?.wallet_address || '-'}
              </div>
            </div>
          </>
        )}
      </div>
      {/* {activeTab === 'crypto' && (
        <>
          {data?.promotion?.name !== '' && (
            <div className='mb-6'>
              <div className='space-y-4'>
                <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                  <div className='flex flex-row items-center gap-2 mb-1'>
                    <IconTicket className='text-app-neutral500' />
                    <p className='text-sm text-app-neutral500'>{lang?.common?.appliedPromotion}</p>
                  </div>
                  <p className='text-app-text-color text-sm'>
                    {data?.promotion?.name !== '' ? data?.promotion?.name : '-'}
                  </p>
                </div>

                <div className='bg-app-background-secondary py-2 px-4 rounded-[8px]'>
                  <div className='flex flex-row items-center gap-2 mb-1'>
                    <IconDPUniversal className='text-app-neutral500' />
                    <p className='text-sm text-app-neutral500'>{lang?.common?.minimalDeposit}</p>
                  </div>
                  <p className='text-app-text-color text-sm'>
                    {thousandSeparatorComma(data?.promotion?.min_deposit ?? '0')}원
                  </p>
                </div>
              </div>
            </div>
          )}
          <iframe
            key={data?.external_deposit_id}
            src={`${CAMOPAY_URL}/${locale || 'ko'}/payment/integration/${
              data?.external_deposit_id
            }?apiKey=${CAMOPAY_KEY}&theme=${theme}`}
            width='100%'
            height='100%'
            className='mb-8 rounded-lg min-h-screen'
            frameBorder='0'
          />
        </>
      )} */}
      {/* Footer Buttons */}
      <div className='mt-auto pb-6 flex flex-col gap-4'>
        <Button
          onClick={() => {
            handleContactSupport(data)
          }}
          className='w-full bg-app-primary hover:bg-app-primary-hover uppercase text-white py-4 text-sm font-medium rounded-lg transition-colors'
        >
          {lang?.common?.contactCustomerService}
        </Button>
        <Button
          path={getLinkTranscationHistory(locale)}
          onClick={onClose}
          variant={'outline'}
          className='w-full text-app-text-color py-4 text-sm font-medium rounded-lg uppercase transition-colors bg-transparent border-app-primary'
        >
          {lang?.common?.transactionHistory}
        </Button>
      </div>
    </>
  )
}
