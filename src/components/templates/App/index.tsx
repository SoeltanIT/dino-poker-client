import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { APP_FEATURES } from '@/utils/app-config'
import { LiveChatProvider } from '@/utils/context/LiveChatProvider'
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

  return (
    <LiveChatProvider licenseId={config['livechat_id']}>
      <AppWrapper locale={locale} lang={dict} config={config} features={APP_FEATURES}>
        {children}
      </AppWrapper>
    </LiveChatProvider>
  )
}

AppTemplate.displayName = 'AppTemplate'

export default AppTemplate
