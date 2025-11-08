import { ANNOUNCEMENTS_DUMMY_DATA } from '@/app/[lang]/announcements/constant'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AnnouncementItem {
  id: string
  image: string
  title: string
  is_active: boolean
  content: string
  position: number
  created_at: string
  updated_at: string
}

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  const initialData = ANNOUNCEMENTS_DUMMY_DATA[locale]

  // let isLoading = true

  // try {
  //   // Fetch user data
  //   initialData = await getListAnnouncement()

  //   if (initialData) {
  //     isLoading = false
  //   }
  // } catch (err: any) {
  //   // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
  //   if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
  //     throw err
  //   }

  //   isLoading = false
  //   // Handle 401 errors from backend
  //   if (err.isUnauthorized || err?.response?.status === 401) {
  //     await handleServerAuthError(locale)
  //     return null // This won't be reached due to redirect
  //   }

  //   err = err.message || 'Failed to load data'
  // }

  return (
    <div className='container max-w-4xl mx-auto min-h-screen mb-16'>
      <Link href={`/${locale}`}>
        <button className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-6 p-0 h-auto hover:bg-transparent'>
          <ArrowLeft className='w-5 h-5' />
          <span>{dict?.common?.goBackHome}</span>
        </button>
      </Link>
      <Card className='overflow-hidden'>
        <CardHeader className='bg-app-primary text-white'>
          <CardTitle className='text-2xl font-bold uppercase'>{dict?.announcements?.title}</CardTitle>
          <CardDescription className='text-white text-base'>{dict?.announcements?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type='single' collapsible className='w-full' defaultValue={'0'}>
            {initialData?.map((item, idx) => (
              <AccordionItem value={idx.toString()} key={idx}>
                <AccordionTrigger
                  className='px-6 border-b border-app-table-border-body rounded-none text-base flex items-center gap-4 hover:no-underline'
                  withIcon={false}
                >
                  <span className='inline-flex items-center gap-4 justify-start'>
                    {idx < 3 && (
                      <span className='text-white uppercase px-2 py-1 text-sm bg-app-table-text-body rounded-sm bg-[#f92630]'>
                        New
                      </span>
                    )}
                    <span className='text-app-text-color'>{item.title}</span>
                  </span>
                  <span className='text-app-text-color text-sm'>{format(new Date(item.created_at), 'yyyy.MM.dd')}</span>
                </AccordionTrigger>
                <AccordionContent className='flex flex-col px-6 bg-[#f8f9fb]'>
                  <div
                    className={cn(
                      'text-app-text-color text-base prose-lg',
                      {
                        'prose-invert': locale === 'ko'
                      },
                      'prose-headings:text-base prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4 prose-ul:list-disc prose-ul:pl-4 prose-ul:my-4',
                      'prose-p:text-base prose-p:my-4',
                      'prose-table:text-base prose-table:my-4 prose-table:border-collapse prose-table:border-spacing-0 prose-th:border prose-td:border prose-table:border-[#303947] prose-table:border-app-table-border-body',
                      'prose-th:bg-[#0a1a2f] prose-table:text-white prose-thead:font-bold prose-td:bg-[#1d2530]',
                      'prose-th:text-start prose-th:text-base prose-th:p-4 prose-th:border-collapse prose-th:border-spacing-0 prose-th:border-[#303947] prose-td:py-2 prose-td:p-4 prose-td:border-collapse prose-td:border-spacing-0 prose-td:border-[#303947]'
                    )}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      {/* <AnnouncementListing lang={dict} locale={locale} initialData={initialData} /> */}
    </div>
  )
}
