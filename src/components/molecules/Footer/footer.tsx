'use client'

import Image from 'next/image'
import { FooterProps } from './types'

export const Footer = ({ children, lang, locale, theme, content, version, ...props }: FooterProps) => {
  const logo = theme === 'dark' ? '/images/logo_footer_light.webp' : '/images/logo_footer_dark.webp'

  return (
    <footer className='bg-app-background-secondary px-8 py-8 pb-[75px]'>
      {/* Logo and Copyright */}
      <div className='flex items-center justify-center mb-8'>
        <div className='flex flex-col items-center gap-4'>
          <Image
            src={logo}
            alt={`Site Logo Footer`}
            width={100}
            height={100}
            priority
            className='md:w-[100px] md:h-[45px] w-[80px] h-[40px]'
          />

          <div className='flex flex-col text-center'>
            <div className='text-app-text-color font-bold text-lg'>KPOKER</div>
            <div className='text-app-neutral500 text-sm'>COPYRIGHT 2025</div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className='text-app-neutral500 text-sm text-center'>
        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
        {/* {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <>
            <div className=''>{lang?.common?.titleFooter}</div>
            <div className='mb-2'>{lang?.common?.subTitleFooter}</div>
          </>
        )} */}
        <div>V1.0.0</div>
      </div>
    </footer>
  )
}
