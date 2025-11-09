'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, useContext } from 'react'

export interface AppFeatures {
  sports: boolean
  promotion: boolean
  crypto: boolean
  livechat: boolean
}

interface AppFeaturesContextType {
  features: AppFeatures
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const AppFeaturesContext = createContext<AppFeaturesContextType | undefined>(undefined)

interface AppFeaturesProviderProps {
  children: ReactNode
  initialFeatures?: AppFeatures
}

async function fetchAppFeatures(): Promise<AppFeatures> {
  const response = await fetch('/api/app-features', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch app features')
  }

  return response.json()
}

export function AppFeaturesProvider({ children, initialFeatures }: AppFeaturesProviderProps) {
  const {
    data: features,
    isLoading,
    isError,
    refetch
  } = useQuery<AppFeatures>({
    queryKey: ['appFeatures'],
    queryFn: fetchAppFeatures,
    initialData: initialFeatures,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  })

  const value: AppFeaturesContextType = {
    features: features ?? {
      sports: false,
      promotion: false,
      crypto: false,
      livechat: false
    },
    isLoading,
    isError: isError ?? false,
    refetch: () => {
      refetch()
    }
  }

  return <AppFeaturesContext.Provider value={value}>{children}</AppFeaturesContext.Provider>
}

export function useAppFeatures(): AppFeaturesContextType {
  const context = useContext(AppFeaturesContext)
  if (context === undefined) {
    throw new Error('useAppFeatures must be used within an AppFeaturesProvider')
  }
  return context
}
