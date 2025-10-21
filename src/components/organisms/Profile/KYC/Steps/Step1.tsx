'use client'

import { KYCSchemaStep1, KYCStep1FormData } from '@/@core/utils/schema/Registration/KYCSchema'
import ImageUploadField from '@/components/molecules/ImageUploadField'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { KYCFormStepProps } from './types'

interface KYCFormStep1Props extends KYCFormStepProps {
  onCancel?: () => void
  onSubmit: (data: KYCStep1FormData) => void
}

export function KYCFormStep1({ lang, locale, onCancel, onSubmit: _onSubmit }: KYCFormStep1Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const form = useForm<KYCStep1FormData>({
    resolver: zodResolver(KYCSchemaStep1(lang)) as Resolver<KYCStep1FormData>,
    defaultValues: {
      name: '',
      date_of_birth: undefined,
      phone_number: '',
      id_card: ''
    }
  })

  const [idCardFilename, setIdCardFilename] = useState<string>('')

  const handleError = useCallback((error: string) => {
    toast.error(error)
  }, [])
  const handleIdCardUploaded = useCallback((filename: string) => {
    setIdCardFilename(filename)
  }, [])

  const onSubmit: SubmitHandler<KYCStep1FormData> = (data: KYCStep1FormData) => {
    setIsLoading(true)
    const timeout = setTimeout(() => {
      setIsLoading(false)
      _onSubmit(data)
    }, 2000)
    return () => clearTimeout(timeout)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <CardContent className='border border-[5px] border-[#EDEEFF] rounded-3xl p-4 text-[#000000] bg-[#FFFFFF]'>
          <div className='mb-7'>
            <p className='text-base font-semibold text-center'>
              {lang?.common?.kycVerification}
              {/* {lang?.register?.kycFormTitle} */}
            </p>
            <p className='text-sm text-center uppercase'>{lang?.common?.kycVerificationDescription}</p>
          </div>
          <div className='space-y-4 mb-7'>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {lang?.register?.name}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={lang?.register?.placeholderName}
                        className='p-4 rounded-full h-auto bg-[#F6F6F6] focus-visible:bg-[#FFFFFF] focus-visible:ring-[#7FCE78] ring-1 focus-visible:ring-1 ring-[#B8B8B8] text-[#000000]'
                      />
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date_of_birth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {lang?.register?.dob || 'Date of Birth'}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={`p-4 rounded-full h-auto bg-[#F6F6F6] active:bg-[#FFFFFF] active:border-[#7FCE78] border border-[#B8B8B8] m-0 w-full text-left font-normal ${
                              !field.value
                                ? 'text-muted-foreground stroke-muted-foreground'
                                : 'text-[#000000] border-[#7FCE78] bg-[#FFFFFF] stroke-[#7FCE78]'
                            }`}
                          >
                            {field.value ? format(field.value, 'yyyy-MM-dd') : lang?.register?.selectDate}
                            <CalendarIcon className={'ml-auto h-4 w-4 stroke-inherit'} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className=' w-auto p-0 m-0' align='start'>
                          <Calendar
                            mode='single'
                            locale={locale}
                            captionLayout='dropdown'
                            defaultMonth={new Date(new Date().getFullYear() - 19, new Date().getMonth())}
                            selected={field.value}
                            onSelect={date => {
                              field.onChange(date)
                              setOpenCalendar(false)
                            }}
                            disabled={date => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {lang?.register?.phoneNumber}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={lang?.common?.typePhoneNumber}
                        className='p-4 rounded-full h-auto bg-[#F6F6F6] focus-visible:bg-[#FFFFFF] focus-visible:ring-[#7FCE78] ring-1 focus-visible:ring-1 ring-[#B8B8B8] text-[#000000]'
                      />
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='id_card'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadField
                        classNames={{
                          label: 'text-[#000000]',
                          wrapper:
                            'border-2 rounded-lg p-4 text-center bg-[#F6F6F6] border-[#B8B8B8] transition-colors overflow-hidden',
                          icon: 'mx-auto h-8 w-8 text-[#000000]',
                          text: 'text-[#000000] text-sm mb-2',
                          button: 'mt-2 bg-[#F6F6F6] border-[#B8B8B8] text-[#000000] hover:bg-[#FFFFFF]',
                          buttonTextLoading: 'text-[#000000] text-xs'
                        }}
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
            </div>
          </div>
          <div className='mb-7'>
            <Button
              type='submit'
              className='w-full text-inherit bg-[#7FCE78] hover:bg-[#7FCE78]/80 p-4 rounded-full h-auto uppercase'
            >
              {isLoading ? (
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-inherit'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              ) : (
                lang?.common?.verify
              )}
            </Button>
            {/* <Button type='button' variant='link' onClick={onCancel} className='w-full text-inherit'>
              Skip
            </Button> */}
          </div>
          <div className='flex justify-center items-center gap-2'>
            <p className='text-sm italic'>{lang?.common?.poweredBy}</p>
            <Image src='/images/vrifytech-logo.png' alt='Powered by' width={100} height={100} className='h-4 w-auto' />
          </div>
        </CardContent>
      </form>
    </Form>
  )
}
