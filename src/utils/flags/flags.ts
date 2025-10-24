// flags.tsx
import { flag } from 'flags/next'

export const showSports = flag({
  key: 'showSports',
  description: 'Show Sports tab in header and navbar',
  decide() {
    // default state in production if nobody overrides it in Toolbar:
    return false
  }
})
