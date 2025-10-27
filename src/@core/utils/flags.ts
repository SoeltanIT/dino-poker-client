import { flag } from 'flags/next'
import flagsConfig from '../../../flags.json'

// 🎯 Login Button Style Flag
export const loginButtonStyleFlag = flag({
  key: 'loginButtonStyle',
  decide: () => flagsConfig.loginButtonStyle.defaultValue
})

// 🎯 Logo Variant Flag
export const logoVariantFlag = flag({
  key: 'logoVariant',
  decide: () => flagsConfig.logoVariant.defaultValue
})

// 🎯 Show Login Button Flag
export const showLoginButtonFlag = flag({
  key: 'showLoginButton',
  decide: () => flagsConfig.showLoginButton.defaultValue
})

// 🎯 Show Logo Flag
export const showLogoFlag = flag({
  key: 'showLogo',
  decide: () => flagsConfig.showLogo.defaultValue
})

// 🎯 Helper functions untuk type safety
export const getLoginButtonStyle = async () => (await loginButtonStyleFlag()) as 'default' | 'modern' | 'minimal'
export const getLogoVariant = async () => (await logoVariantFlag()) as 'light' | 'dark' | 'animated'
export const shouldShowLoginButton = async () => (await showLoginButtonFlag()) as boolean
export const shouldShowLogo = async () => (await showLogoFlag()) as boolean
