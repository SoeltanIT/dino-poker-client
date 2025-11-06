import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { getWebConfig } from '@/utils/api/internal/webConfig'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)
  const webConfig = await getWebConfig()

  const configMap = Object.fromEntries(webConfig.map(item => [item.key, item.value])) as ConfigType

  const userGuide = locale === 'ko' ? configMap['user_guide_ko'] : configMap['user_guide']

  return (
    <div className='mx-auto w-full max-w-screen-2xl space-y-4 md:px-20 px-6 mt-4 mb-[36px]'>
      <div className='mb-[36px]'>
        <h1 className='text-3xl font-bold text-app-text-color uppercase'>{dict?.common?.userGuide}</h1>
      </div>
      <div
        className='prose mx-auto'
        dangerouslySetInnerHTML={{
          __html: userGuide
        }}
      />
    </div>
  )
}
