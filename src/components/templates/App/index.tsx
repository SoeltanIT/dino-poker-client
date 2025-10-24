import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { LiveChatProvider } from '@/utils/context/LiveChatProvider'
import { FC, ReactNode } from 'react'
import AppWrapper from './AppWrapper'
import { showSports } from '@/utils/flags/flags'

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

  // ✅ evaluate feature flag ON THE SERVER
  const isSportsEnabled = await showSports()

  return (
    <LiveChatProvider licenseId={config['livechat_id']}>
      <AppWrapper locale={locale} lang={dict} config={config} showSports={isSportsEnabled}>
        {children}
      </AppWrapper>
    </LiveChatProvider>
  )
}

AppTemplate.displayName = 'AppTemplate'

export default AppTemplate
