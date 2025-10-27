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

// 🎯 Helper functions untuk type safety
export const getLoginButtonStyle = async () => (await loginButtonStyleFlag()) as 'default' | 'modern' | 'minimal'
export const getLogoVariant = async () => (await logoVariantFlag()) as 'light' | 'dark' | 'animated'
export const shouldShowLoginButton = async () => (await showLoginButtonFlag()) as boolean
export const shouldShowLogo = async () => (await showLogoFlag()) as boolean
