import { BetByIframe } from '@/components/organisms/SportIframe/SportIframe'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'

export default async function Home({
  params: { slug },
  searchParams
}: {
  params: { slug?: string[] }
  searchParams: { [key: string]: string }
}) {
  const lang = await getDictionary()
  const locale = await getLocal()

  return <BetByIframe lang={lang} locale={locale} />
}
