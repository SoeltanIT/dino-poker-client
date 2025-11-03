import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
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

  const features = {
    sports: process.env.FEATURE_SHOW_SPORTS === 'true',
    promotion: process.env.FEATURE_SHOW_PROMOTION === 'true',
    crypto: process.env.FEATURE_SHOW_CRYPTO === 'true'
  }

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
