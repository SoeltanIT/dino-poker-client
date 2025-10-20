'use client'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { KYCStep1FormData, KYCStep2FormData } from '@/@core/utils/schema/Registration/KYCSchema'
import { IconSize, IconVerifyCheck } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { KYCFormStep1, KYCFormStep2 } from './Steps'
import { KYCFormProps } from './types'

export default function KYCForm({ lang, locale, onClose, isStatus }: KYCFormProps) {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<KYCStep1FormData | null>(null)

  const msgVerifyStatus = (status?: string) => {
    const stat = status && status.toLowerCase()
    switch (stat) {
      case 'unverified':
        return lang?.common.verifyCheckMsg
      case 'pending':
        return lang?.common.verifyPendingMsg
      case 'rejected':
        return lang?.common.verifyRejectedMsg
      default:
        return lang?.common.verifyCheckMsg
    }
  }

  const { mutateAsync: updateKYC, isPending } = useMutationQuery<any, any>(
    ['userUpdate'],
    'put',
    'json',
    true,
    lang?.common?.verifyKYCSuccess,
    [['user', 'me']]
  )

  const handleClick = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.LiveChatWidget !== 'undefined' &&
      typeof window.LiveChatWidget.call === 'function'
    ) {
      if (!ready) {
        console.warn('[LiveChat] Widget is not ready yet. Aborting...')
        return
      }

      const widget = window.LiveChatWidget

      if (!widget || typeof widget.call !== 'function') {
        console.error('[LiveChat] LiveChatWidget is not available or malformed.')
        return
      }

      if (session?.user) {
        widget.call('set_customer_name', session.user.name ?? '')
        widget.call('set_customer_email', session.user.email ?? '')
      } else {
        //console.warn('[LiveChat] Session user not found. Skipping customer info.')
      }
      window.LiveChatWidget.call('maximize')
    } else {
      //console.warn('[LiveChat] Widget not ready')
    }
  }

  const handleClose = () => {
    setStep(1)
    setStep1Data(null)
    onClose()
  }

  const openContactUS = () => {
    handleClick()
    handleClose()
  }

  const onSubmit = async (data: KYCStep2FormData) => {
    try {
      const resp = await updateKYC({
        url: '/updateKYC',
        body: {
          name: step1Data?.name,
          date_of_birth: step1Data?.date_of_birth ? format(step1Data.date_of_birth, 'yyyy-MM-dd') : '',
          phone_number: step1Data?.phone_number,
          transaction_password: data?.transaction_password,
          bank_account_number: data?.bank_account_number,
          bank_name: data?.bank_name,
          id_card: step1Data?.id_card || '',
          phone_number_code: '+1'
        }
      })
      if (resp?.status === 'success') {
        handleClose()
      }
      // console.log('KYC form submitted successfully:', resp)
    } catch (error) {
      // console.error('Error submitting KYC form:', error)
      return
    }
  }

  return isStatus !== 'APPROVED' && isStatus !== 'UNVERIFIED' ? (
    <div className='h-[70vh] flex flex-col justify-center items-center mt-10'>
      <IconVerifyCheck size={IconSize['3xl']} />
      <span className='text-sm font-semibold text-app-text-color text-center'>{msgVerifyStatus(isStatus)}</span>
      {(isStatus === 'PENDING' || isStatus === 'REJECTED') && (
        <Button
          onClick={() => openContactUS()}
          className='w-full bg-app-primary uppercase hover:bg-app-primary-hover mt-4 text-white py-4 text-base font-medium rounded-lg transition-colors'
        >
          {lang?.common?.contactUS}
        </Button>
      )}
    </div>
  ) : (
    <div>
      {step === 1 && (
        <KYCFormStep1
          lang={lang}
          locale={locale}
          onCancel={() => {
            setStep(1)
            setStep1Data(null)
            onClose()
          }}
          onSubmit={data => {
            setStep1Data(data)
            setStep(2)
          }}
        />
      )}

      {step === 2 && <KYCFormStep2 lang={lang} locale={locale} isPending={isPending} onSubmit={onSubmit} />}
    </div>
  )
}
