import { getDictionary, getLocal } from '@/dictionaries/dictionaries'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  return <div className='mx-auto w-full max-w-screen-2xl space-y-4 md:px-20 px-6 mt-4'>ISI Events Page</div>
}
