import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { LiveChatProvider } from '@/utils/context/LiveChatProvider'
import { getAppFeaturesServer } from '@/utils/server/app-features'
import { FC, ReactNode } from 'react'
import AppWrapper from './AppWrapper'

interface AppTemplateProps {
  children?: ReactNode | string
  config: ConfigType
  params: {
    lang: 'ko' | 'en'
  }
}

const AppTemplate: FC<AppTemplateProps> = async ({ children, params, config, ...props }) => {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocal()
  // ✅ central feature registry

  const features = await getAppFeaturesServer()

  return (
    <LiveChatProvider licenseId={config['livechat_id']}>
      <AppWrapper locale={locale} lang={dict} config={config} features={features}>
        {children}
      </AppWrapper>
    </LiveChatProvider>
  )
}

AppTemplate.displayName = 'AppTemplate'

export default AppTemplate
