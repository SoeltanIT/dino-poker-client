// lib/livechat-reset.ts
export function resetLiveChatSession(opts: { hardReload?: boolean } = {}) {
  if (typeof window === 'undefined') return

  const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
  const names = ['lc_cid', 'lc_cst', '__lc_cid', '__lc_cst']
  const host = location.hostname.replace(/^www\./, '')
  const domains = [host, `.${host}`]

  // 1) Kill cookies across domain variants
  names.forEach(n => {
    document.cookie = `${n}=; expires=${expire}; path=/`
    domains.forEach(d => {
      document.cookie = `${n}=; expires=${expire}; path=/; domain=${d}`
    })
  })

  // 2) Nuke storage keys LC uses
  try {
    localStorage.removeItem('@@lc_auth_token')
    localStorage.removeItem('@@lc_ids')

    for (const k of Object.keys(localStorage)) {
      if (/livechat|^lc[_-]?/i.test(k)) localStorage.removeItem(k)
    }
    for (const k of Object.keys(sessionStorage)) {
      if (/livechat|^lc[_-]?/i.test(k)) sessionStorage.removeItem(k)
    }
  } catch {}

  // 3) Politely close UI if API is around
  try {
    // @ts-ignore
    const api = (window as any).LC_API
    api?.close_chat?.()
    api?.minimize_chat_window?.()
  } catch {}

  // 4) Reload widget or the page
  if (opts.hardReload) {
    location.reload()
    return
  }

  // Soft reload: remove tracking.js and re-inject
  const SRC_PART = 'cdn.livechatinc.com/tracking.js'
  document.querySelectorAll(`script[src*="${SRC_PART}"]`).forEach(s => s.parentElement?.removeChild(s))

  // Clear the proxy so a fresh queue is made on next init
  // @ts-ignore
  delete (window as any).LiveChatWidget

  const s = document.createElement('script')
  s.async = true
  s.src = 'https://cdn.livechatinc.com/tracking.js'
  document.head.appendChild(s)
}
