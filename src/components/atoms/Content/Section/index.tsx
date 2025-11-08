import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export interface SectionProps extends ComponentProps<'section'> {
  title: string
}

export function Section({ title, children, className }: ComponentProps<'section'>) {
  return (
    <section className={cn('mb-8', className)}>
      <h3 className='text-sm md:text-base font-bold mb-2 text-app-text-color'>{title}</h3>
      <div className='text-app-neutral500 py-2 mb-2 last-of-type:mb-0 space-y-3 [&_p]:first-of-type:mt-0 [&_p]:last-of-type:mb-0 [&_p]:leading-relaxed [&_ol]:first-of-type:mt-0'>
        {children}
      </div>
    </section>
  )
}
