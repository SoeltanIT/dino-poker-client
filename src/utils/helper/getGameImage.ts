import { Locale } from '@/i18n-config'

export type GameImageItem = {
  image?: string
  image_ko?: string
  image_light?: string
  image_light_ko?: string
}

/**
 * Selects the correct game image based on theme and locale.
 * - Fallback to dark image if light image is null/undefined.
 */
export function getGameImage(item: GameImageItem, theme: 'light' | 'dark', locale?: Locale) {
  if (theme === 'dark') {
    return locale === 'ko' ? item?.image_ko ?? item?.image : item?.image ?? item?.image_ko
  }

  // theme === 'light'
  if (locale === 'ko') {
    return item.image_light_ko || item.image_ko || item.image
  }

  return item.image_light || item.image || item.image_ko
}
