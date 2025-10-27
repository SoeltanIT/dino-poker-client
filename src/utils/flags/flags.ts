import { flag } from 'flags/next'

export const showSports = flag({
  key: 'showSports',
  description: 'Show Sports tab in header and navbar',
  decide() {
    return false
  }
})
