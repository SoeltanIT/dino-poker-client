// hooks/useTheme.ts
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { THEME_COOKIE_NAME, getValidTheme, Theme } from '@/lib/theme'

export function useThemeToggle() {
  const [cookies, setCookie] = useCookies([THEME_COOKIE_NAME])
  const [theme, setTheme] = useState<Theme>(() => getValidTheme(cookies[THEME_COOKIE_NAME]))

  const applyThemeToBody = (theme: Theme) => {
    document.body.classList.remove('light-theme', 'dark-theme')
    document.body.classList.add(`${theme}-theme`)
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyThemeToBody(nextTheme)
    setCookie(THEME_COOKIE_NAME, nextTheme, { path: '/', sameSite: 'lax' })
  }

  useEffect(() => {
    const current = getValidTheme(cookies[THEME_COOKIE_NAME])
    setTheme(current)
    applyThemeToBody(current)
  }, [cookies[THEME_COOKIE_NAME]])

  return { theme, toggleTheme }
}
