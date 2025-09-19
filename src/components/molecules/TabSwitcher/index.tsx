'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { TabSwitcherProps } from '@/types/tabTypes'

export function TabSwitcher<T extends string>({ tabs, activeTab, onTabChange }: TabSwitcherProps<T>) {
  return (
    <div className='flex space-x-2 w-full rounded-[8px] overflow-hidden mb-4 bg-app-background-secondary p-2'>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'h-[35px] flex-1 py-2 px-3 text-center rounded-lg text-sm transition-colors uppercase',
            activeTab === tab.value ? 'bg-app-primary font-medium text-white' : 'bg-app-white100 text-app-text-color'
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}
