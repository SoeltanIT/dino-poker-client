import { AdjustmentUsernameForm } from '@/app/(blank-layout)/[lang]/adjustment/_components/AdjustmentUsernameForm'
import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'

export default async function AdjustmentPage({ params }: { params: { lang: Locale } }) {
  const lang = await getDictionary(params?.lang)
  return (
    <div className='flex items-center justify-center flex-1'>
      <AdjustmentUsernameForm lang={lang} />
    </div>
  )
}
