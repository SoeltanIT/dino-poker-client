
import { flag } from 'flags/next'

/**
 * Show the "Sports" tab in:
 * - Header nav
 * - Mobile bottom Navbar
 * Also used to guard /[lang]/sport route.
 */
export const showSports = flag({
  key: 'showSports',
  description: 'Show Sports tab in header and navbar',
  // This runs on the server. If Toolbar has no override for
  // this flag, this value is the default.
  decide() {
    return false // start hidden by default in production
  }
})

/**
 * Show the "Promotion" tab / page link (future use).
 * You can wire this later just like showSports.
 */
export const showPromotion = flag({
  key: 'showPromotion',
  description: 'Show Promotion tab/link in header and navbar',
  decide() {
    return false
  }
})
