'use client'

import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import { AffiliateCasinoGroupTable } from '@/components/organisms/Affiliate/AffiliateDetail/AffiliateCasinoGroupTable'
import { AffiliateSportGroupTable } from '@/components/organisms/Affiliate/AffiliateDetail/AffiliateSportGroupTable'
import { LangProps } from '@/types/langProps'
import { useState } from 'react'

export interface AffiliateGroupProps {
  lang?: LangProps
}

export function AffiliateGroup({ lang }: AffiliateGroupProps) {
  const [activeTab, setActiveTab] = useState('casino')
  const tabs = [
    { name: lang?.header?.casino, value: 'casino' },
    { name: lang?.header?.sport, value: 'sport' }
  ]

  return (
    <>
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'casino' ? <AffiliateCasinoGroupTable lang={lang} /> : <AffiliateSportGroupTable lang={lang} />}
    </>
  )
}
