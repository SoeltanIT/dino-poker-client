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
  const [activeTab, setActiveTab] = useState('poker')
  const tabs = [
    { name: lang?.header?.poker, value: 'poker' },
    { name: lang?.header?.casino, value: 'casino' }
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
