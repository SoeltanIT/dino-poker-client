import { Bai_Jamjuree, Noto_Sans_KR } from 'next/font/google'

// ============================================================================
// Optimized Font Loading for Mobile Performance
// ============================================================================

export const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap', // Prevent invisible text during font loading
  preload: true, // Preload for better performance
  fallback: ['system-ui', 'arial'] // System font fallback
})

export const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap', // Prevent invisible text during font loading
  preload: true, // Preload for better performance
  fallback: ['system-ui', 'arial'] // System font fallback
})
