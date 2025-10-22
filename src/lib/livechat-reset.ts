// lib/livechat-reset.ts
export function resetLiveChatSession(opts: { hardReload?: boolean } = {}) {
  if (typeof window === 'undefined') return

  // 0) Politely destroy current instance (no-ops if not loaded)
  try {
    window.LiveChatWidget?.call?.('destroy')
  } catch {}

  // 1) Kill cookies across domain variants
  const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
  const names = [
    // current + legacy + v2 variants
    'lc_cid',
    'lc_cst',
    '__lc_cid',
    '__lc_cst',
    '__lc2_cid',
    '__lc2_cst'
  ]
  const host = location.hostname.replace(/^www\./, '')
  const domains = [host, `.${host}`]

  names.forEach(n => {
    // default path
    document.cookie = `${n}=; expires=${expire}; path=/`
    // explicit domain variants
    domains.forEach(d => {
      document.cookie = `${n}=; expires=${expire}; path=/; domain=${d}`
    })
  })

  // 2) Nuke storage keys LiveChat may use
  try {
    localStorage.removeItem('@@lc_auth_token')
    localStorage.removeItem('@@lc_ids')

    for (const store of [localStorage, sessionStorage]) {
      Object.keys(store).forEach(k => {
        const kk = k.toLowerCase()
        if (kk.includes('livechat') || kk.startsWith('lc') || kk.startsWith('__lc')) {
          store.removeItem(k)
        }
      })
    }
  } catch {}

  // 3) Clean global proxy so a fresh queue is made on next init
  try {
    delete (window as any).LiveChatWidget
  } catch {}

  // 4) Reload page or re-inject script
  if (opts.hardReload) {
    location.reload()
    return
  }


}
