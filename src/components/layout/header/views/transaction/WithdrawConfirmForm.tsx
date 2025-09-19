import { CountdownTimer } from '@/components/molecules/CountdownTimer/CountdownTimer'
import { DepositConfirmFormProps } from './types'
import { Button } from '@/components/ui/button'

export default function DepositConfirmForm({ lang }: DepositConfirmFormProps) {
  return (
    <>
      <div className='mb-5'>
        <p className='text-app-text-color text-xl font-bold uppercase'>{lang?.common?.waitingPayment}</p>
      </div>

      {/* Payment Time */}
      <div className='flex items-center gap-[10px] mb-[30px]'>
        <span className='text-sm text-app-neutral100'>{lang?.common?.paymentTime}:</span>
        <div className='flex items-center justify-center bg-app-primary min-w-[120px] h-[30px] rounded-2xl text-app-text-color'>
          <CountdownTimer />
        </div>
      </div>

      {/* Content + QR (flex-grow zone) */}
      <div className='flex flex-col flex-grow'>
        <div className='flex flex-col w-full max-h-[90px] bg-app-background-secondary rounded-[16px] items-center justify-center gap-[3px] py-4 mb-[30px]'>
          <span className='text-xs text-app-placeholder'>{lang?.common?.totalPayment}</span>
          <span className='text-[32px] text-app-text-color'>₩1234</span>
        </div>

        {/* {activeSubTab === 'CRYPTO' && (
              <div className='flex flex-col items-center justify-center gap-4 mb-[30px]'>
                <Image
                  src={'/images/generateQrCode.png'}
                  alt='QR Code'
                  width={1000}
                  height={1000}
                  className='h-[250px] w-[250px] object-contain object-center'
                />
                <Button
                  variant={'outline'}
                  className='min-w-[130px] text-app-text-color text-xs font-medium rounded-lg uppercase transition-colors bg-transparent p-4'
                >
                  {lang?.common?.downloadQRCode}
                </Button>
              </div>
            )} */}
      </div>

      {/* Footer Buttons */}
      <div className='mt-auto pb-6 flex flex-col gap-4'>
        {/* {activeSubTab !== 'CRYPTO' && ( */}
        <Button className='w-full bg-app-primary hover:bg-app-primary-hover uppercase text-app-text-color py-4 text-sm font-medium rounded-lg transition-colors'>
          {lang?.common?.contactCustomerService}
        </Button>
        {/* )} */}
        <Button
          variant={'outline'}
          className='w-full text-app-text-color py-4 text-sm font-medium rounded-lg uppercase transition-colors bg-transparent border-app-primary'
        >
          {lang?.common?.transactionHistory}
        </Button>
      </div>
    </>
  )
}
