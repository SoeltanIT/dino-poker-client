import { flag } from 'flags/next'

// 🎯 Login Button Style Flag
export const loginButtonStyleFlag = flag({
  key: 'loginButtonStyle',
  defaultValue: 'default',
  decide: () => 'default'
})

// 🎯 Logo Variant Flag
export const logoVariantFlag = flag({
  key: 'logoVariant',
  defaultValue: 'light',
  decide: () => 'light'
})

// 🎯 Show Login Button Flag
export const showLoginButtonFlag = flag({
  key: 'showLoginButton',
  defaultValue: true,
  decide: () => true
})

// 🎯 Show Logo Flag
export const showLogoFlag = flag({
  key: 'showLogo',
  defaultValue: true,
  decide: () => true
})
