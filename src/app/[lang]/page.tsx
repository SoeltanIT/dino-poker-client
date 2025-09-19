import { BifrostIframe } from '@/components/organisms/BifrostIframe/BifrostIframe'
import { getLocal } from '@/dictionaries/dictionaries'

export default async function Home({
  params: { slug },
  searchParams
}: {
  params: { slug?: string[] }
  searchParams: { [key: string]: string }
}) {
  // const lang = await getDictionary();
  const locale = await getLocal()

  return <BifrostIframe language={locale} />
}
