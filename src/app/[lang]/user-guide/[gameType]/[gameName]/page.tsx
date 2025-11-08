'use client'
import { Card } from '@/components/ui/card'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface PageProps {
  params: Promise<{
    gameType: 'poker' | 'sport'
    gameName: string
    lang: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { lang, gameType, gameName } = await params
  const {
    default: Content,
    title,
    heroImage
  } = await import(`@/content/user-guide/${gameType}/${lang}/${gameName}.mdx`)

  return (
    <>
      <div className='mb-3'>
        <h1 className='text-3xl md:text-4xl font-bold'>{title}</h1>
      </div>

      <Card className='relative overflow-hidden mb-8 border-0 bg-[#0F3C37] text-white'>
        <div className='p-6 md:p-8 lg:p-10'>
          <div className='flex items-start justify-between gap-6'>
            <div className='max-w-[70%]'>
              <div className='text-xs md:text-sm opacity-80 mb-2'>KPOKER</div>
              <h2 className='text-2xl md:text-3xl font-bold leading-tight'>
                텍사스 홀덤 <span className='block'>게임설명</span>
              </h2>
            </div>

            <div className='relative w-28 h-20 md:w-40 md:h-28 shrink-0 translate-y-2 rotate-6'>
              {heroImage ? (
                <Image src={heroImage} alt='user guide' fill className='object-cover rounded-md shadow-md' />
              ) : (
                <div className='w-full h-full grid place-items-center bg-white/10 rounded-md'>
                  <ImageIcon className='w-8 h-8' />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className='prose [&_h3]:m-0 [&_h3]:mb-2 [&_p]:first-of-type:mt-0 [&_p]:text-app-text-color max-w-none'>
        <Content />
      </div>
    </>
  )
}
