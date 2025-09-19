'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { KYCFormData, KYCSchema } from '@/@core/utils/schema/Registration/KYCSchema'
import { IconSize, IconVerifyCheck } from '@/components/atoms/Icons'
import ImageUploadField from '@/components/molecules/ImageUploadField'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ListMasterBankDTO } from '@/types/listMasterBankDTO'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { KYCFormProps } from './types'

export default function KYCForm({ lang, locale, onClose, isStatus }: KYCFormProps) {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()
  const [idCardFilename, setIdCardFilename] = useState<string>('')
  const [selfieFilename, setSelfieFilename] = useState<string>('')

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

  type FormType = KYCFormData
  type ResolverType = Resolver<FormType>

  const form = useForm<FormType>({
    resolver: zodResolver(KYCSchema(lang)) as ResolverType,
    defaultValues: {
      bank_account_number: '',
      bank_name: '',
      // bank_account_name: '',
      id_card: '',
      // id_number: '',
      consent: false
      // selfie: ''
    }
  })

  const handleIdCardUploaded = useCallback((filename: string) => {
    setIdCardFilename(filename)
  }, [])

  const handleSelfieUploaded = useCallback((filename: string) => {
    setSelfieFilename(filename)
    if (filename) {
      // toast.success('Selfie uploaded successfully!')
    }
  }, [])

  const handleError = useCallback((error: string) => {
    toast.error(error)
  }, [])

  const { data: respListMasterBank, isLoading } = GetData<ListMasterBankDTO[]>(
    '/listMasterBank', // hits your Next.js API route, not the real backend
    ['getListMasterBank']
  )

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    try {
      const resp = await updateKYC({
        url: '/updateKYC',
        body: {
          bank_account_number: data?.bank_account_number,
          bank_name: data?.bank_name,
          id_card: data?.id_card || ''
        }
      })
      if (resp?.status === 'success') {
        onClose()
      }
      // console.log('KYC form submitted successfully:', resp)
    } catch (error) {
      // console.error('Error submitting KYC form:', error)
      return
    }
  }

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

  const openContactUS = () => {
    handleClick()
    onClose()
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
    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information */}
        <div className=''>
          <p className='text-base font-semibold text-app-text-color mb-4'>{lang?.register?.kycFormTitle}</p>

          <CardContent className='space-y-4'>
            {/* <div className='grid grid-cols-1 gap-4'>
            <FormField
              control={form.control}
              name='id_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.idNumber}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={lang?.register?.placeholderIDNumber} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />
          </div> */}

            <div className='grid grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='id_card'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadField
                        label={lang?.register?.idCard}
                        lang={lang}
                        accept='.jpeg,.jpg,.png,.bmp'
                        maxSize={5}
                        required={true}
                        placeholder={lang?.register?.upload}
                        value={field.value}
                        onChange={field.onChange}
                        onError={handleError}
                        onImageUploaded={handleIdCardUploaded}
                      />
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />

              {/* <ImageUploadField
              lang={lang}
              accept='.jpeg,.jpg,.png,.bmp'
              label={lang?.register?.selfie}
              maxSize={5}
              placeholder={lang?.register?.upload}
              required={true}
              onError={handleError}
              onImageUploaded={handleSelfieUploaded}
            /> */}
            </div>
          </CardContent>
        </div>

        {/* Bank Information */}
        <div className='space-y-6'>
          <p className='text-base font-semibold text-app-text-color mb-4'>{lang?.register?.bankInformation}</p>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='bank_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.bank}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='bg-app-white100 text-app-text-color'>
                          <SelectValue placeholder={lang?.common?.selectBank} />
                        </SelectTrigger>
                        <SelectContent className='bg-app-background-primary'>
                          {respListMasterBank &&
                            (respListMasterBank.length > 0 ? (
                              respListMasterBank?.map((item: ListMasterBankDTO, index) => (
                                <SelectItem key={index} value={item.bank_name} className='text-app-text-color'>
                                  {item.bank_name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value='No Data Bank Available' disabled className='text-app-text-color'>
                                {lang?.common?.noBankAvailable || 'No banks available'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bank_account_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.accountNumber}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={lang?.common?.typeAccountNumber} />
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </div>

        <FormField
          control={form.control}
          name='consent'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='text-app-text-color font-medium'>{lang?.register?.consentForAdvertising}</FormLabel> */}
              <FormControl>
                <div className='flex items-start space-x-2 mt-2'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-1 data-[state=checked]:bg-app-primary data-[state=checked]:border-app-primary'
                  />
                  <FormLabel className='text-app-danger text-sm leading-relaxed'>{lang?.common?.consentKYC}</FormLabel>
                </div>
              </FormControl>
              <FormMessage className='text-app-danger' />
            </FormItem>
          )}
        />

        {/* Consent */}
        {/* <div className='space-y-4'>
            <CardContent className='pt-2'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='consent'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-app-text-color font-medium'>
                        {lang?.register?.consentForAdvertising}
                      </FormLabel>
                      <FormControl>
                        <div className='flex items-start space-x-2 mt-2'>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='mt-1 data-[state=checked]:bg-app-primary data-[state=checked]:border-app-primary'
                          />
                          <FormLabel className='text-app-danger text-sm leading-relaxed'>
                            {lang?.register?.checkBoxConsent}
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage className='text-app-danger' />
                    </FormItem>
                  )}
                />

                <div className='border border-app-white100 rounded-lg p-4 space-y-2'>
                  <div className='space-y-2 text-sm text-app-danger'>
                    <div className='flex items-start space-x-2'>
                      <div className='w-2 h-2 bg-app-neutral500 rounded-full mt-2 flex-shrink-0'></div>
                      <p className='text-sm text-app-neutral500'>{lang?.register?.notesConsent1}</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <div className='w-2 h-2 bg-app-neutral500 rounded-full mt-2 flex-shrink-0'></div>
                      <p className='text-sm text-app-neutral500'>{lang?.register?.notesConsent2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div> */}

        <div className='pt-8'>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
          >
            {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.verify}
          </Button>
        </div>
      </form>
    </Form>
  )
}
