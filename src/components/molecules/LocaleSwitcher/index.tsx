'use client'

import { IconSouthKoreaFlag, IconUSAFlag } from '@/components/atoms/Icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { i18n } from '@/i18n-config'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LocaleSwitcherDropdown({ lang }: { lang: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const currentLang = pathname.split('/')[1]
  const restPath = pathname.split('/').slice(2).join('/')

  const handleChangeLanguage = (lang: string) => {
    if (lang === currentLang) return // prevent reload on same language
    setIsOpen(false)
    const newUrl = `/${lang}/${restPath}`
    window.location.href = newUrl // ✅ forces LiveChat reinit
  }

  return (
    <div className='flex relative'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role='button'
            aria-label='Change Language'
            className='relative text-app-text-color hover:bg-app-bg-button-hover w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-colors'
          >
            <span className='text-xl'>{currentLang === 'en' ? <IconUSAFlag /> : <IconSouthKoreaFlag />}</span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align='end'
          side='bottom'
          className='w-[150px] border-app-neutral600 shadow-xl rounded-xl overflow-hidden z-[1000] mt-1'
          sideOffset={8}
        >
          <div className='flex flex-col'>
            {i18n.locales.map(lang => {
              const isCurrent = lang === currentLang
              return (
                <button
                  key={lang}
                  onClick={() => handleChangeLanguage(lang)}
                  disabled={isCurrent}
                  className={`w-full text-left px-3 py-2 transition-all uppercase flex items-center gap-3 ${
                    isCurrent ? 'bg-app-neutral500 text-white' : 'bg-app-neutral700 text-white hover:bg-app-neutral300'
                  }`}
                >
                  {lang === 'en' ? (
                    <>
                      <IconUSAFlag />
                      <span className='text-sm'>English</span>
                    </>
                  ) : (
                    <>
                      <IconSouthKoreaFlag />
                      <span className='text-sm'>한국어</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
