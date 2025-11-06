import { AppFeatures } from '@/@core/context/AppFeaturesContext'
import { get } from '@vercel/edge-config'

/**
 * Server-side function to fetch app features from edge config
 * This is used for SSR and initial data hydration
 */
export async function getAppFeaturesServer(): Promise<AppFeatures> {
  try {
    // Fetch from edge config
    const features = await get<AppFeatures>('appFeatures')

    // Fallback to environment variables if edge config is not available
    const fallbackFeatures: AppFeatures = {
      sports: false,
      promotion: false,
      crypto: false
    }

    // Merge edge config with fallback (edge config takes priority)
    return {
      sports: features?.sports ?? fallbackFeatures.sports,
      promotion: features?.promotion ?? fallbackFeatures.promotion,
      crypto: features?.crypto ?? fallbackFeatures.crypto
    }
  } catch (error) {
    console.error('[getAppFeaturesServer] Error fetching from edge config:', error)

    // Fallback to environment variables on error
    return {
      sports: false,
      promotion: false,
      crypto: false
    }
  }
}
