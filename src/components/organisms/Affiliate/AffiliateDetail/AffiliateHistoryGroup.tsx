'use client'

import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import { LangProps } from '@/types/langProps'
import { useState } from 'react'
import { AffiliateHistoryOthersTable } from './AffiliateHistoryOthersTable'
import { AffiliateHistoryPokerTable } from './AffiliateHistoryPokerTable'

export interface AffiliateHistoryGroupProps {
  lang?: LangProps
}

export function AffiliateHistoryGroup({ lang }: AffiliateHistoryGroupProps) {
  const [activeTab, setActiveTab] = useState('casino')
  const tabs = [
    { name: lang?.header?.casino, value: 'casino' },
    { name: lang?.header?.sport, value: 'sport' }
  ]

  return (
    <>
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'casino' ? (
        <AffiliateHistoryOthersTable lang={lang} />
      ) : (
        <AffiliateHistoryPokerTable lang={lang} />
      )}
    </>
  )
}
